# Build Optimization

> 之前文章介绍了 CI / CD 相关概念及主流工具，利用此类工具能便捷地进行持续集成及发布，但构建自动化并不意味着构建流程的结束，恰好是构建优化的开始。

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

   :::tip 友情提示
   本地存储时，倘若存在多个项目或代码仓库，需要对其缓存做区分，不可如上做简单处理
   :::

2. 完成了缓存的存储后，还需要面对应用新鲜度的问题。当应用的<code>package.json</code> 中的依赖更新时，需要移除缓存并进行更新。

   如何监测依赖更新成为需要解决的问题，方案其实有很多，可以参阅：[npm install if package.json was modified](https://stackoverflow.com/questions/52466740/npm-install-if-package-json-was-modified)

   通常做法可以分为**监测文件变化**（ package.json ）和**监测依赖变化**（ package.json 中 dependencies 及 devDependencies ）两大类。

   监测依赖变化在实现上复杂点，但缓存的更新会更精确，可以通过比对前后依赖项生成校验文件 md5 来判定依赖是否发生变更，相关实现可参阅：[ninesalt/install-changed](https://github.com/ninesalt/install-changed/blob/master/lib/main.js)

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

之前的自动化部署主要是以 github pages 为载体，但在实际构建过程中需要分发代码至各服务器。

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

上面从缓存和分发角度优化了构建项，使得整体构建更加自动化、速度更快。总体来说，以上的优化已经能满足日常构建的大部分场景。但倘若思考下整个构建流程，优化依然可以继续。

目前来说，利用 Drone 部署远程 CI 服务器，所有的构建都是在容器内进行，已经完成了环境隔离，保障了本地与远程构建结果的一致性。

稍微回望这一流程，拉取远端代码，构建产出 dist 目录的过程，其实是可以采用 Dockerfile 文件生成 dist 镜像文件来解决。Dockerfile 文件如下：

```bash
FROM node:alpine as builder
# 注入环境变量
ENV PROJECT_ENV production
ENV NODE_ENV production
# 新建工作目录
WORKDIR /site
WORKDIR /site-build
ADD ./ /site-build/
# 执行构建命令
RUN yarn install && \
    yarn run build && \
    mv  /site-build/dist /site/ && \
    rm -rf /site-build
```
如上利用 Dockerfile 可以不需引入 CI 服务器，即可完成打包的操作。

重新审视下 Dockerfile 缓存和分发同样存在问题，缓存怎么处理？分发怎么处理？

缓存其实可以走 Node 基础镜像来解决，本地构建出 Node 基础镜像（包含 node_modules ），  
 



## 参考链接

- [The ultimate DroneCI caching guide](https://laszlo.cloud/the-ultimate-droneci-caching-guide)

- [Making Drone Builds 10 Times Faster!](https://underthehood.meltwater.com/blog/2019/04/10/making-drone-builds-10-times-faster/)

- [如何使用 docker 高效部署前端应用](https://shanyue.tech/post/deploy-frontend-with-docker/)

- [Drone 将 VUE 项目持续部署到阿里云 OSS](http://trylife.cn/drone-ci/vue-continuous-deploy-to-aliyun-oss/)

- [容器环境持续集成优化，Drone CI 提速 500%](https://avnpc.com/pages/speed-up-drone-ci-workflow)

- [npm install if package.json was modified](https://stackoverflow.com/questions/52466740/npm-install-if-package-json-was-modified)

- [Git - show file diff between HEAD and initial (first) version](https://stackoverflow.com/questions/41371090/git-show-file-diff-between-head-and-initial-first-version)

- [Finding diff between current and last version?](https://stackoverflow.com/questions/9903541/finding-diff-between-current-and-last-version)

- [ssh, rsync, and tar](https://medium.com/@amy/ssh-rsync-and-tar-8812a5a47410)

- [两台Linux系统之间传输文件的几种方法](https://blog.csdn.net/gatieme/article/details/51673229)

- [Build not running on tag](https://discourse.drone.io/t/build-not-running-on-tag/3376)

- [Cannot execute a pipeline on either tag or push to specific branch
](https://discourse.drone.io/t/cannot-execute-a-pipeline-on-either-tag-or-push-to-specific-branch/3490/4)