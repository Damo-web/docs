# Build Optimization

> 之前文章介绍了 CI / CD 相关概念及主流工具，利用此类工具能便捷地进行持续集成及发布，但构建自动化并不意味着构建流程的结束，恰好是构建优化的开始。

![](./img/build_1.png)

## 缓存

缓存（ Cache ）是构建流程中必须面对的话题。

在持续集成及发布中，缓存是一把双刃剑，一方面，想尽可能的利用缓存，提升构建速度；一方面，想废弃缓存，确保应用的新鲜度。

以 Node 为例，在 build 之前，需要利用 <code>node_modules</code> 来提升构建速度，而当 <code>package.json</code> 中依赖发生变更时，需要清空缓存，安装新增包或更新变更包，确保应用如期运行。

下面以 Drone CI 为例，演示下构建过程中缓存的处理：

1. 介于 Drone CI 是容器化的自动化工具，并不能如 Jenkins 直接存储缓存至工作区中，倘若不能存储在工作区，其实很容易想到，可以使用**第三方存储**或**容器共享文件夹**来实现同样效果。

   Drone CI 是基于插件化的自动化工具，缓存相关的插件如下：

   - [Drillster/drone-volume-cache](https://github.com/Drillster/drone-volume-cache)

   - [meltwater/drone-cache](https://github.com/meltwater/drone-cache)

   - [drone-plugins/drone-s3-cache](https://github.com/drone-plugins/drone-s3-cache)

   - [hvalle/drone-gcs-cache](https://github.com/hvalle/drone-gcs-cache)

   - [appleboy/drone-sftp-cache](https://github.com/appleboy/drone-sftp-cache)

   从上述插件可以看出，缓存插件也是分为第三方存储（ S3、GCS、SFTP 等 ）和容器共享文件夹 ( volume ) 两大类，当然也有插件对这两项做了融合，比如<code>meltwater/drone-cache</code>插件。

   因<code>meltwater/drone-cache</code>插件处理 <code>node_modules</code> 本地存储时，存在<code>node_modules/.bin</code>文件夹无法缓存的问题（ 可查阅：[Allow to configure skipping symbolic links](https://github.com/meltwater/drone-cache/issues/39) )，因此采用<code>drillster/drone-volume-cache</code>插件作为本地缓存存储方案。

   本文利用主机下<code>/var/drone-cache</code>文件夹来缓存构建时<code>node_modules</code>文件夹，当应用下次构建时可以复用该文件夹下的缓存，从而跳过包安装过程的漫长等待，提升构建速度。<code>.drone.yml</code>示例配置如下：

   ```yaml
   # 详细配置可查阅：https://github.com/Drillster/drone-volume-cache/blob/master/DOCS.md
   steps:
     # 取出存储 cache
     - name: restore-cache
         image: drillster/drone-volume-cache
         settings:
           restore: true
           mount:
             - ./node_modules
         # 加载 cache 数据卷，CI服务器对应仓库需要勾选 "Trusted"
         volumes:
           - name: cache
             path: /cache
     # 构建其他步骤，在此不做显示
     - ...
     # 重新存储 cache
     # 此步骤一般在发布至远程服务器前执行，用来确保 cache 的新鲜度
     - name: rebuild-cache
         image: drillster/drone-volume-cache
         settings:
           rebuild: true
           mount:
             - ./node_modules
         volumes:
           - name: cache
             path: /cache
   volumes:
     - name: cache
       host:
         # 倘若 path 不存在，需要在 CI 服务器上新建相应文件夹
         path: /var/drone-cache
   ```

   :::tip 小贴士
   本地存储时，倘若存在多个项目或代码仓库，需要对其缓存做区分，不可如上做简单处理
   :::

2. 完成了缓存的存储后，还需要面对应用新鲜度的问题。当应用的<code>package.json</code> 中的依赖更新时，需要移除缓存并进行更新。

   如何监测依赖更新成为需要解决的问题，方案其实有很多，可以参阅：[npm install if package.json was modified](https://stackoverflow.com/questions/52466740/npm-install-if-package-json-was-modified)

   通常做法可以分为**监测文件变化**（ package.json ）和**监测依赖变化**（ package.json 中 dependencies 及 devDependencies ）两大类。

   监测依赖变化在实现上复杂点，但缓存的更新会更精确，可以通过比对前后依赖项生成校验文件的 md5 来判定依赖是否发生变更，相关实现可参阅：[ninesalt/install-changed](https://github.com/ninesalt/install-changed/blob/master/lib/main.js)

   监测文件变化在实现上简单点，可以利用 Git 来实现，可以通过比对前后两次 package.json 文件是否有变动来判定依赖是否发生变更，但往往不太精确，package.json 中非 dependencies 及 devDependencies 部分的变动也会触发清除缓存的操作。

   能不能把这两种方式结合起来，取长补短？

   在 Node 中，依赖会通过 <code>package-lock.json</code> 或 <code>yarn.lock</code> 来锁版本，当依赖变更时，对应的<code>package-lock.json</code> 或 <code>yarn.lock</code> 也会更新。可以通过检测 lock 文件变化来判定依赖是否发生变更。

   在发布版本时，通常会利用 npm version 命令进行版本更新，此时 <code>package-lock.json</code> 中 version 字段也会更新，并不能满足预期。而<code>yarn.lock</code>不会因 npm version 命令进行文件更新，只有当 dependencies 及 devDependencies 变动时才会更新。

   通过以上的对比，宜采用 yarn 来管理包，并监测 <code>yarn.lock</code> 文件的变化来更新缓存。

   ```bash
    # pre-install.sh 文件
    #!/bin/bash
    # 判断当前与上次提交中 yarn.lock 是否有变化
    changes=$(git diff HEAD^ HEAD -- yarn.lock)
    if [ -n "$changes" ]; then
      echo ""
      echo "*** CHANGES FOUND ***"
      echo "$changes"
      echo "Yarn.lock has changed"
      # 因 drillster/drone-volume-cache 并不可控，此处删除拉取后的缓存，以保证包的新鲜度
      rm -rf ./node_modules
      yarn install
    else
      echo ""
      echo "*** CHANGES NOT FOUND ***"
      echo "Yarn.lock keep unchanged"
      yarn install
    fi
   ```

   ```yaml {11-15}
    steps:
      - name: restore-cache
          image: drillster/drone-volume-cache
          settings:
            restore: true
            mount:
              - ./node_modules
          volumes:
            - name: cache
              path: /cache
      # 执行上述 sh 脚本
      - name: install
        image: node
        commands:
          - bash ./pre-install.sh
      - name: rebuild-cache
          image: drillster/drone-volume-cache
          settings:
            rebuild: true
            mount:
              - ./node_modules
          volumes:
            - name: cache
              path: /cache
    volumes:
      - name: cache
        host:
          path: /var/drone-cache
   ```

## 分发

之前博客的自动化部署主要是以 github pages 为载体，但在实际部署过程中需要分发代码至各服务器。

在 Jenkins CI 中，这一操作通常利用 Publish Over SSH 插件来进行完成，大致过程如下：

```bash
# 连接 Jenkins CI VPC（ Virtual Private Cloud ）网络
# VPC 通常称为私有网络或者专有网络，更加安全，自定义度更高
SSH: Connecting from host [vpc-jenkins-ci]
# configuration 中即为分发服务器的配置项
SSH: Connecting with configuration [vpc-web-prod-1-172.36.13.46] ...
# 这里利用管道来传输文件，即压缩文件至 STDOUT 
# 再利用 SSH 连接 Web服务器，拷贝并解压传输文件至对应文件夹，并删除压缩的传输文件
SSH: EXEC: STDOUT/STDERR from command [cd /var/www/web/docs
tar xzf docs.tar.gz -C /var/www/web/docs
rm -f docs.tar.gz] ...
SSH: EXEC: completed after 501 ms
# 完成后断开连接，继续执行分发任务
SSH: Disconnecting configuration [vpc-web-prod-1-172.36.13.46] ...
SSH: Transferred 1 file(s)
SSH: Connecting from host [vpc-jenkins-ci]
SSH: Connecting with configuration [vpc-web-prod-2-172.16.26.115] ...
SSH: EXEC: STDOUT/STDERR from command [cd /var/www/web/docs
tar xzf docs.tar.gz -C /var/www/web/docs
rm -f docs.tar.gz] ...
SSH: EXEC: completed after 600 ms
SSH: Disconnecting configuration [vpc-web-prod-2-172.16.26.115] ...
SSH: Transferred 1 file(s)
Build step 'Send files or execute commands over SSH' changed build result to SUCCESS
Finished: SUCCESS
```

概括来说，CI 服务器需先通过 SSH 连接 Web 服务器，分发时再传输文件至对应的 Web 服务器。

以 Drone CI 为例，具体步骤如下：

1. 在 CI 服务器下生成无密码的 Public SSH Keys

```bash
# 执行命令，下述结果仅为执行参考
$ ssh-keygen

# 执行结果
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa):
# passphrase 为 key 的密码，默认设置空 ，表示不需要密码
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:YwhPC9gxq6OPmVJ7XYiKI257bSPPnfpdBc root@snowball
The key's randomart image is:
+---[RSA 2048]----+
|   o*o           |
|  oo.=.          |
| =o=..          |
|+ o.o=+o.        |
| +o. ++oS.E      |
|..+.. .. . .     |
|.o + .... .      |
| +=.oo+. .       |
|++==+=.          |
+----[SHA256]-----+

# 查看私钥
$ cat /root/.ssh/id_rsa
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAs1rxWQZzK+pOLbXY7vdLMoMfA85QVavrwuR06RksLImlFiXj
lDLhmYZUUijspp1Zw775+9VQxldejiCsL3mhzWSJPJ9wO5TJi1CXLn5QsEjY39dC
s5SEVq1EhqnVN0fjQqHaJn8GOOfy5bvzyTmV8WgO8Pl4CeR5vuuQbRYFDP+rjQnH
zLpeq73FiWASMRT5vIrZ1Rk92JoGN7TtBdI3ipP+O1kMimO0sATB9Rruww+lpuuZ
63jbHjPfmY24czMHbtbkpNjyDZNyvC7Mi2RNuIwcDkz4LQOJuWni
-----END RSA PRIVATE KEY-----

# 查看公钥
$ cat id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAA2gQNDCo99NsjZzrkYYRZ4Uohrgt8LPXxTF0Zr3 root@snowball

```

2. 复制 Public SSH Keys ，登录 Web 服务器，保存至 <code>~/.ssh/authorized_keys</code> 文件

```bash
$ ssh root@45.88.74.102 'mkdir -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub
# 成功后退出登录的 Web 服务器
# 在 CI 服务器通过 SSH 连接 Web 服务器，免密可登录则表示设置成功
$ ssh root@45.88.74.102
```

3. 配置 Drone CI 仓库设置项

   ![](./img/build_2.png)

   REMOTE_HOST 为第一台 Web 服务器 IP 地址，REMOTE_HOST2 为第二台 Web 服务器 IP 地址，以此类推；RSYNC_KEY 为 CI 服务器 Private SSH Key；RSYNC_USER 为 Web 服务器用户名，通常为 root

4. 配置 <code>.drone.yml</code> 文件

   服务器间数据传输存在 rsync、nc、ftp、scp、nfs 等多种方式，本文采用 rsync 来传输数据。
   
   rsync 是一个远程数据同步工具，可以通过 LAN/WAN 快速同步多台主机间的文件。rsync 使用 rsync 算法来保持本地和远程两个主机间的文件同步，只传送两个主机同一文件的不同部分，而不是每次全量更新，这种增量更新的方式，提升了文件传输的速度。

   Drone CI 中一般使用 [drillster/drone-rsync](https://github.com/Drillster/drone-rsync/blob/master/1-DOCS.md) 插件来传输服务器间数据。示例如下：

   ```yaml
   - name: rsync
     image: drillster/drone-rsync
     environment:
       RSYNC_KEY:
         from_secret: RSYNC_KEY
       RSYNC_USER:
         from_secret: RSYNC_USER
       REMOTE_HOST:
         from_secret: REMOTE_HOST
       REMOTE_HOST2:
         from_secret: REMOTE_HOST2
     settings:
       hosts:
         - $$REMOTE_HOST
         - $$REMOTE_HOST2
     source: ./dist
     # 需要在 Web 服务器上安装 nginx
     # nginx 默认静态资源文件夹
     target: /usr/share/nginx/html
   ```

## 容器化

上面从缓存和分发角度优化了构建流程，使得整个构建更加自动化、速度更快。总体来说，以上的优化已经能满足日常构建的大部分场景。但倘若思考下整个构建流程，优化依然可以继续。

目前来说，利用 Drone 部署远程 CI 服务器，所有的构建都是在容器内进行，已经完成了环境隔离，保障了本地与远程构建结果的一致性。

稍微回望这一流程，拉取远端代码，构建产出 dist 目录的过程，其实是可以采用 Dockerfile 文件生成 dist 静态镜像来解决。Dockerfile 文件如下：

```bash
FROM node:alpine as builder
# 注入环境变量
ENV PROJECT_ENV production
ENV NODE_ENV production
# 新建工作目录
WORKDIR /src
WORKDIR /src-build
ADD ./ /src-build/
# 执行构建命令
RUN yarn install && \
    yarn run build && \
    mv  /src-build/dist /src/ && \
    rm -rf /src-build
```
如上利用 Dockerfile 可以不需引入 CI 服务器，即可完成打包的操作。

倘若不引入 CI 服务器，利用 Dockerfile 来进行打包同样要处理缓存和分发问题：每次构建时，<code>yarn install</code> 都需要重新执行一遍，安装导致的时间和安全成本巨大；分发的话，需要通过上传镜像至私有 Docker 镜像仓库，再进入 Web 服务器执行拉取镜像并运行容器的操作。

- 回顾前端构建的流程，只需要保障 Node版本 、yarn版本 及 node_modules 文件夹一致，即可保证生成 dist 文件的一致。那么，是不是可以把这三者做成 Node 基础镜像来为 Web 服务器端的构建服务。

  因需要区分 Node 基础镜像和其他构建镜像，新建 <code>node.dockerfile</code>，如下：

  ```bash
  # 拉取 node 镜像
  FROM node:alpine
  # 新建并进入工作区
  RUN mkdir /src
  WORKDIR /src
  # 复制当前 package.json 相关文件至工作区
  COPY ./package*.json /src/
  COPY ./yarn.lock /src/
  # 安装包
  RUN yarn install
  ```

  在当前目录下执行构建镜像，如下：

  ```bash
  # 构建 Node 基础镜像
  # -t 镜像的 tag
  # -f Dockerfile 的名字 (默认为 ‘Dockerfile’)
  # .  代表当前文件夹的所有文件，并发送至 Docker daemon
  # 具体可查阅：https://docs.docker.com/v17.12/engine/reference/commandline/build/
  $ docker build -t node-base -f node.dockerfile .
  # 构建过程
  Sending build context to Docker daemon  133.4MB
  Step 1/6 : FROM node:alpine
  alpine: Pulling from library/node
  e7c96db7181b: Pull complete 
  773afe93be0d: Pull complete 
  223db68b3560: Pull complete 
  609526630549: Pull complete 
  Digest: sha256:25d56cf8f21a33f61415bcde0dd7fb1e1d46ecdb9b3b6d39e4846570cc235a81
  Status: Downloaded newer image for node:alpine
  ---> d4edda39fb81
  Step 2/6 : RUN mkdir /src
  ---> Running in 6c79b449d11f
  Removing intermediate container 6c79b449d11f
  ---> 7b232a36912b
  Step 3/6 : WORKDIR /src
  ---> Running in 2c91d05c5d08
  Removing intermediate container 2c91d05c5d08
  ---> e031c4db6733
  Step 4/6 : COPY ./package*.json /src/
  ---> b24da7a66597
  Step 5/6 : COPY ./yarn.lock /src/
  ---> 967926c6ebaf
  Step 6/6 : RUN yarn install
  ---> Running in 8d75cadf2142
  yarn install v1.16.0
  [1/4] Resolving packages...
  [2/4] Fetching packages...
  info fsevents@1.2.9: The platform "linux" is incompatible with this module.
  info "fsevents@1.2.9" is an optional dependency and failed compatibility check. Excluding it from installation.
  [3/4] Linking dependencies...
  [4/4] Building fresh packages...
  Done in 120.07s.
  Removing intermediate container 8d75cadf2142
  ---> defa3914799b
  Successfully built defa3914799b
  Successfully tagged node-base:latest
  ```

  这样便完成了 Node 基础镜像的制作，但本地镜像并不能共享，而各环境倘若需要保证一致性的话，需要引用同一基础镜像，此时可以上传至 Docker hub 公有或私有仓库，或利用[ Harbor ](https://github.com/goharbor/harbor)搭建公司镜像管理平台，或利用阿里云等云服务商提供的镜像仓库服务。比较推荐 Harbor 自建镜像管理平台，保障镜像服务的安全性和稳定性。

  基础镜像线上化后，不需要安装任何环境和包，只需执行构建即可，缓存问题迎刃而解，而且方便追踪及复现线上故障，可谓一箭双雕。

- 回望分发 Web 服务器时，直接传输 dist 到 nginx 默认文件夹，需要预先在服务器上配置 nginx 环境及配置文件，当 Web 服务器增多后，这一阶段比较繁琐，也容易出错。

  倘如部署时，只需运行 Docker 镜像便能访问 Web 服务，就能轻松地进行服务器扩展及收缩，也方便在本地追踪和复现线上问题。

  之前的 Dockerfile 其实可以一拆为三，分为 Node 基础镜像、Dist 静态镜像及 Nginx 部署镜像。因 Nginx 部署镜像仅需 Dist 静态镜像提供配置文件及静态资源，可以利用 Docker 的多阶段构建将两镜像进行合并。

  :::tip 小贴士
  Docker 的多阶段构建只会保留最后阶段的文件和命令，可查阅[ docker | multistage-build ](https://docs.docker.com/develop/develop-images/multistage-build/) 
  :::
  
  在当前目录下，新建 <code>web.dockerfile</code>，如下：

  ```bash
  # 拉取 node 基础镜像
  # 这里以本地镜像为例
  FROM node-base as builder
  # 进入 node 基础镜像下 src 目录
  WORKDIR /src
  # 复制当前目录文件至 src 目录下
  COPY . /src/
  # 打包静态资源
  RUN yarn build

  # 拉取 nginx 基础镜像
  FROM nginx:alpine
  # 新建工作区
  WORKDIR /root 
  # 复制 builder 阶段 /src/dist 文件至当前 nginx 目录
  COPY --from=builder /src/dist /usr/share/nginx/html 
  # 暴露端口（ nginx 基础镜像默认 80 端口，可忽略 ）
  EXPOSE 80 
  ```

  在当前目录下执行构建镜像，如下：

  ```bash
  $ docker build -t web-nginx -f web.dockerfile .
  # 构建过程
  Sending build context to Docker daemon  133.4MB
  Step 1/8 : FROM node-base as builder
  ---> defa3914799b
  Step 2/8 : WORKDIR /src
  ---> Using cache
  ---> 7bec27b99d51
  Step 3/8 : COPY . /src/
  ---> b90d93e4aa54
  Step 4/8 : RUN yarn build
  ---> Running in 0e50b49dda4d
  yarn run v1.16.0
  $ vuepress build docs
  wait Extracting site metadata...
  tip Apply theme @vuepress/theme-default ...
  tip Apply plugin container (i.e. "vuepress-plugin-container") ...
  tip Apply plugin @vuepress/register-components (i.e. "@vuepress/plugin-register-components") ...
  tip Apply plugin @vuepress/active-header-links (i.e. "@vuepress/plugin-active-header-links") ...
  tip Apply plugin @vuepress/search (i.e. "@vuepress/plugin-search") ...
  tip Apply plugin @vuepress/nprogress (i.e. "@vuepress/plugin-nprogress") ...
  tip Apply plugin @vuepress/pwa (i.e. "@vuepress/plugin-pwa") ...
  tip Apply plugin @vuepress/last-updated (i.e. "@vuepress/plugin-last-updated") ...
  tip Apply plugin @vuepress/back-to-top (i.e. "@vuepress/plugin-back-to-top") ...
  tip Apply plugin @vuepress/medium-zoom (i.e. "@vuepress/plugin-medium-zoom") ...
  ℹ Compiling Client
  ℹ Compiling Server
  ✔ Server: Compiled successfully in 6.89s
  ✔ Client: Compiled successfully in 11.04s
  wait Rendering static HTML...
  wait Generating service worker...
  success Generated static files in dist.

  Done in 13.70s.
  Removing intermediate container 0e50b49dda4d
  ---> c8270562d518
  Step 5/8 : FROM nginx:alpine
  ---> bfba26ca350c
  Step 6/8 : WORKDIR /root
  ---> Using cache
  ---> bbea1e258a05
  Step 7/8 : COPY --from=builder /src/dist /usr/share/nginx/html
  ---> 600974ff3c47
  Step 8/8 : EXPOSE 80
  ---> Running in 387166dcd7c4
  Removing intermediate container 387166dcd7c4
  ---> 75e21d8027cc
  Successfully built 75e21d8027cc
  Successfully tagged web-nginx:latest
  ```

  接下来把该镜像上传到镜像仓库，在各预装 docker 的 Web 服务器上直接拉取并运行就行了。  

整理完思路，但单靠上述容器化的实践并不能实现自动化部署的工作，将容器化理念融入进 Drone CI 工作流中才是务实之举。

之前利用 Drone Plugin 的功能，完成了缓存和分发的工作。其实容器化之后也大同小异，但需要对 <code>.drone.yml</code> 文件进行相应变更，细节如下：

- 取消 CI 服务器本地缓存 node_modules 文件的策略，使用远程 docker image 来取代

  ```yaml
  # .drone.yml
  - name: build-web-image
    # 私有镜像，这里采用 harbor 来进行存储和管理
    # 细节可参阅：https://github.com/goharbor/harbor
    image: harbor.snowball.site/web/node-base
    # 挂载主机 daemon 用来 tag
    volumes:
      - name: dockersock
        path: /var/run/docker.sock
    environment:
      HARBOR_USERNAME:
        from_secret: HARBOR_USERNAME
      HARBOR_PWD:
        from_secret: HARBOR_PWD
    commands: 
      # node 基础镜像没内置 git 和 docker，需要进行安装
      - apk add --no-cache git
      - apk add docker
      # 登陆私有镜像仓库（ 倘若是公有仓库则可以忽略 ）
      - docker login harbor.snowball.site -u $$HARBOR_USERNAME -p $$HARBOR_PWD
      # 执行 auto-check.sh 脚本来检测缓存变更
      # web.dockerfile 宜采用本地镜像，如 node-base ，保证缓存的新鲜度
      - sh ./build/auto-check.sh
      # 构建 web-nginx 镜像并推送至远程
      - docker build -t web-nginx -f web.dockerfile .
      - docker tag web-nginx harbor.snowball.site/web/web-nginx
      - docker push harbor.snowball.site/web/web-nginx
    # 容许主机访问主机服务
    privileged: true
  # 配置私有镜像仓库授权信息
  # 可参阅：https://discourse.drone.io/t/1-0-0-rc1-how-to-pull-image-from-private-registry-and-execute-commands-in-it/3057/12
  image_pull_secrets:
    - dockerconfigjson
  ```

  ```bash
  # auto-check.sh
  #!/bin/bash
  echo ========== CHECKING FOR CHANGES ========
  changes=$(git diff HEAD^ HEAD -- yarn.lock)
  if [ -n "$changes" ]; then
      echo ""
      echo "*** CHANGES FOUND ***"
      echo "$changes"
      echo "Yarn.lock has changed"
      # 依赖变更时，需要构建新 node-base 镜像并推送至远程私有仓库
      docker build -t node-base -f node.dockerfile .
      docker tag node-base harbor.snowball.site/web/node-base
      docker push harbor.snowball.site/web/node-base
  else
      echo ""
      echo "*** CHANGES NOT FOUND ***"
      echo "Yarn.lock has not changed"
  fi
  ```


- 取消 CI 服务器传输文件至远程 Web 服务器的策略，使用拉取远程 docker image 来取代

  ```yaml
  # .drone.yml
  - name: publish-web-server
    #  使用 drone-ssh 插件连接远程服务器
    image: appleboy/drone-ssh
    settings:
      host:
        from_secret: REMOTE_HOST_1
        from_secret: REMOTE_HOST_2
      username: 
        from_secret: REMOTE_USER
      key: 
        from_secret: REMOTE_KEY
      # 暴漏至 script 的环境变量
      envs: [ HARBOR_USERNAME,HARBOR_PWD ]
      script:
        - docker -v
        # 停止并删除原有 container
        - docker container stop web-server
        - docker rm -f web-server
        # 拉取最新镜像并运行
        - docker login harbor.snowball.site -u $$HARBOR_USERNAME -p $$HARBOR_PWD
        - docker pull harbor.snowball.site/web/web-nginx
        - docker run -d -p 3080:80 --name web-server harbor.snowball.site/web/web-nginx
  ```

至此，Drone CI 容器化完成。

需要说明的是，Dockerfile 构建时每行命令都是 Layer，Docker 构建时使用 Layer Cache 可以加速镜像构建过程，无需担心构建所产生的时间成本。整体构建用时与之前不相伯仲，如下图：

![](./img/build_3.png)

容器化完成之后，基础镜像和服务镜像都存放至 Harbor 私有仓库，如下图：

![](./img/build_4.png)

基于此，可以便捷地复用和管理镜像，方便追踪及复现线上故障，增强了 Web 服务的伸缩性。


:::tip 小贴士
  在实际工作中，Harbor 中的镜像可以通过 tag 来区分版本号，以利于回滚，此处只用作简单演示
:::


## 体积

应用的体积是构建时需要面对的棘手问题，在前端服务中，主要体现在 npm 包和 Docker 镜像两方面：

- npm 包

  npm 包分为 devDependencies 和 dependencies 两种依赖，其中 devDependencies 是日常开发环境所依赖的包，在部署时其实并不需要安装。

  可以通过一下命令来优化 node_modules 文件夹的体积：

  ```bash
  # yarn
  # 只安装 dependencies 中的包
  $ yarn install --production
  # npm 
  $ npm prune --production
  ```

- Docker 镜像

  Docker 镜像也存在大小之分，比如，Docker Hub 上就存在多个 Node 镜像，不同的镜像具有不同的大小，而在容器时代，Alpine 是最轻量的镜像，因此可以把基础镜像都采用 Alpine 版本，这样生成的镜像足够小，便于推送和拉取。

  ```bash
  # Dockerfile 中拉取 Alpine 版本
  FROM node:alpine
  # or
  FROM nginx:alpine
  ```

## 网络
  
在网络层面，国内访问 npm 镜像源、Docker 镜像源 及 Github 仓库并不稳定，速度堪忧。这可能会导致 npm 包安装失败、Docker 镜像拉取失败、Github 仓库推送代码失败或过慢等问题。

当然，解决方案也有很多，可以采用国外云服务器、引用国内镜像源或利用网络代理来解决。

国内镜像源其实并不能解决 Github 仓库推送问题，而网络代理在 Docker 容器中存在诸多问题，推荐采用国外云服务器来解决。

同等配置下的国外云服务和国内阿里云服务器部署的 Drone CI ，无 node_modules 缓存，同次构建耗时依次如下：

![](./img/build_5.png)

国外云服务构建详细信息：

![](./img/build_6.png)

国内阿里云服务器构建详细信息：

![](./img/build_7.png)

对比可见，主要耗时集中于 yarn install 和 deploy github 这两个阶段。 在拉取 Docker 镜像时，国内阿里云服务器偶尔会抛出无法获取镜像的错误，如下：

```bash
Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
```

为解决国内网络问题带来的构建用时成本，倘若条件容许，可以自建代码仓库（ GitLab、Gogs、Gitea 等 ）、自建 npm 服务器（ sinopia、cnpm 等 ）及自建 dokcer 镜像仓库（ harbor等 ）来避免。

倘若条件不容许，针对 npm 官方源 和 Docker 镜像源，可以采用国内镜像源来简单处理：

- npm 镜像源

  ```bash
  $ yarn config set registry "https://registry.npm.taobao.org"
  ```

- Docker 镜像源

  在 Linux 云服务的<code>/etc/docker/daemon.json</code>文件下写入如下信息：
  
  ```bash
  # daemon.json 倘若不存在则新建
  {
    "registry-mirrors": [
      "https://dockerhub.azk8s.cn",
      "https://reg-mirror.qiniu.com"
    ]
  }
  ```
  
  重启 Docker 服务：

  ```bash
  # 以 root 权限运行
  $ systemctl daemon-reload
  $ systemctl restart docker
  ```


## 参考链接

- [The ultimate DroneCI caching guide](https://laszlo.cloud/the-ultimate-droneci-caching-guide)

- [Making Drone Builds 10 Times Faster!](https://underthehood.meltwater.com/blog/2019/04/10/making-drone-builds-10-times-faster/)

- [如何使用 docker 高效部署前端应用](https://shanyue.tech/post/deploy-frontend-with-docker/)

- [Drone 将 VUE 项目持续部署到阿里云 OSS](http://trylife.cn/drone-ci/vue-continuous-deploy-to-aliyun-oss/)

- [容器环境持续集成优化，Drone CI 提速 500%](https://avnpc.com/pages/speed-up-drone-ci-workflow)

- [前端项目容器化之旅](http://imhxl.com/post/docker-frontend-project.html)

- [npm install if package.json was modified](https://stackoverflow.com/questions/52466740/npm-install-if-package-json-was-modified)

- [Git - show file diff between HEAD and initial (first) version](https://stackoverflow.com/questions/41371090/git-show-file-diff-between-head-and-initial-first-version)

- [Finding diff between current and last version?](https://stackoverflow.com/questions/9903541/finding-diff-between-current-and-last-version)

- [ssh, rsync, and tar](https://medium.com/@amy/ssh-rsync-and-tar-8812a5a47410)

- [两台Linux系统之间传输文件的几种方法](https://blog.csdn.net/gatieme/article/details/51673229)

- [Build not running on tag](https://discourse.drone.io/t/build-not-running-on-tag/3376)

- [Cannot execute a pipeline on either tag or push to specific branch](https://discourse.drone.io/t/cannot-execute-a-pipeline-on-either-tag-or-push-to-specific-branch/3490/4)

- [Docker 最佳实践之多阶段构建](https://www.hi-linux.com/posts/55545.html)

- [为什么不能在服务器上 npm install ？](https://zhuanlan.zhihu.com/p/39209596)

- [How to Build and Deploy Docker Images with Drone](http://paislee.io/how-to-build-and-deploy-docker-images-with-drone/)

- [[1.0.0-rc1] How to pull image from private registry and execute commands in it](https://discourse.drone.io/t/1-0-0-rc1-how-to-pull-image-from-private-registry-and-execute-commands-in-it/3057/12)

- [Docker Credential Store](https://www.projectatomic.io/blog/2016/03/docker-credentials-store/)

- [git not found in alpine image](https://github.com/nodejs/docker-node/issues/586)

- [Secret in Drone 1.0.0-rc.1](https://github.com/appleboy/drone-ssh/issues/130)

- [docker practice](https://yeasy.gitbooks.io/docker_practice/install/mirror.html)

- [Piplenes: docker login can not perform an interactive login from a non TTY](https://community.atlassian.com/t5/Bitbucket-questions/Piplenes-docker-login-can-not-perform-an-interactive-login-from/qaq-p/595736)