# Jenkins CI

> 本篇目为 Jenkins CI 搭建指南，以静态博客为例，覆盖构建、发布及通知流程。

## 前言

Jenkins 无疑是当下最广泛使用的开源 CI 工具，其丰富的插件系统、权限系统为企业的持续集成提供了可靠的拓展性和丰富的定制性。

## 说明

[Jenkins](https://jenkins.io/download/) 部署方式有多种，推荐采用 Docker 或 Linux 环境来进行安装，不推荐 Mac OS 直接安装（ 修改默认配置繁琐 ）。

## 安装

本篇以阿里云 CentOS 系统为例，演示了 Jenkins 整个安装过程。

关于阿里云的使用可参阅：[阿里云ECS使用指南](https://damo-web.github.io/docs/server/)

Jenkins 依赖 Java 和 Git ，如果系统未自带，执行下述命令：

```bash
# 安装 git
sudo yum install git
# 安装 java
sudo yum install java
```

Jenkins 安装所需命令：

```bash

sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo

sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key

sudo yum install jenkins

```

启动 Jenkins：

```bash
sudo service jenkins start
# 显示如下状态即是启动成功，打开浏览器，输入阿里云服务器公网地址的 8080 端口
# 需要在阿里云平台安全组规则中把端口暴露出来，才可以访问云服务器对应端口
Starting jenkins (via systemctl):                          [  OK  ]
```


## 配置

:::tip 提示

为了避免权限所引发的问题，以下命令建议均以 root 权限进行运行。

:::

1. 配置云服务器安全组规则

    可按如下顺序进入安全组：

    > 实例列表 => 更多 => 网络和安全组 => 安全组配置 => 配置规则 => 添加安全组规则

    ![](./img/jenkins_1.png)

2. 配置 Jenkins 管理员账号

    浏览器访问 Jenkins 地址 http://ali-server-ip:8080，出现如下页面：

    ![](./img/jenkins_2.png)

    执行如下命令，把初始的管理员密码复制进去，并安装推荐插件，创建管理员账户后，就可以进入 Jenkins 首页

    ```bash
    cat /var/lib/jenkins/secrets/initialAdminPassword
    ```

3. 配置 Jenkins 任务
    
    点击 Jenkins 首页面板中新建任务即可建立项目任务

    ![](./img/jenkins_3.png)

4. 配置前端项目构建插件

    构建前端项目需要配置 Node 环境，代码也需要从 Github 拉取并发布，因此需要在插件管理中安装 	<code>NodeJS Plugin</code> 、 <code>	GitHub Integration Plugin</code>、<code>Publish Over SSH</code>三个插件。

    可按如下顺序安装插件：

    > 系统管理 => 插件管理 => 可选插件 => 过滤 => 勾选插件 => 直接安装

    ![](./img/jenkins_4.png)

5. 配置 Node 环境

   首先需要配置 Node 版本及别名：

   > 系统管理 => 全局工具配置 => NodeJS => NodeJS安装

   ![](./img/jenkins_5.png)

   其次，在任务面板中进入项目配置页，配置如下：
   
   ![](./img/jenkins_6.png)

   :::tip 提示
   倘若系统中已安装 Node环境，也可以在 Shell 脚本里加入<code>export PATH=/usr/local/bin</code> 命令来启动 Node
   :::

6. 配置 Github Webhook

    Github 服务器相关配置主要利用 Github Webhook 来触发 Jenkins 任务的构建。

    首先需要生成 Github Personal Access Token，细节可参阅：[Github | creating-a-personal-access-token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line#creating-a-token)

    其次配置包含 Github Personal Access Token 的 Jenkins 凭据以供 Github 服务器使用：

    ![](./img/jenkins_7.png)

    再者，补充相关服务器信息，选择刚创建的凭据进行连接测试，如下图所示，即为 Github 服务器配置成功：

    ![](./img/jenkins_8.png)

    Github 服务器配置成功后，进入项目配置页，如下图配置即完成 Github Webhook 的全部配置工作：

    ![](./img/jenkins_9.png)

7. 配置 SSH 秘钥

    通常利用 ssh-keygen 来生成秘钥对：

    ```bash
    # 执行命令，下述结果仅为执行参考
    ssh-keygen

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
    cat /root/.ssh/id_rsa
    -----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAs1rxWQZzK+pOLbXY7vdLMoMfA85QVavrwuR06RksLImlFiXj
    lDLhmYZUUijspp1Zw775+9VQxldejiCsL3mhzWSJPJ9wO5TJi1CXLn5QsEjY39dC
    s5SEVq1EhqnVN0fjQqHaJn8GOOfy5bvzyTmV8WgO8Pl4CeR5vuuQbRYFDP+rjQnH
    zLpeq73FiWASMRT5vIrZ1Rk92JoGN7TtBdI3ipP+O1kMimO0sATB9Rruww+lpuuZ
    63jbHjPfmY24czMHbtbkpNjyDZNyvC7Mi2RNuIwcDkz4LQOJuWni
    -----END RSA PRIVATE KEY-----

    # 查看公钥
    cat id_rsa.pub
    ssh-rsa AAAAB3NzaC1yc2EAA2gQNDCo99NsjZzrkYYRZ4Uohrgt8LPXxTF0Zr3 root@snowball
    ```

    在 Jenkins 下新建全局凭据，添加私钥，如下图所示：

    > 凭据 => 系统 => 全局凭据

    ![](./img/jenkins_10.png)

    在 Github 仓库下新建 Deploy keys ，添加公钥，如下图所示：

    ![](./img/jenkins_11.png)

8. 配置 Git 仓库

    当配置好 Github Webhook 和 SSH 秘钥，就可以进入项目配置页，配置 Git 仓库来拉取及推送代码（ 推荐采用 SSH ）：

    ![](./img/jenkins_12.png)


9. 配置 Shell 命令

    进入项目配置页，配置 Shell 环境变量及命令，用来执行构建任务：

    ![](./img/jenkins_13.png)

    至此，Jenkins 已可以通过源代码 push 事件实现自动化部署静态博客。

    当然，可以对部署配置做一些简单优化，比如添加 Github 链接、丢弃旧构建、删除工作区域缓存等，如下图：

    ![](./img/jenkins_14.png)

    ![](./img/jenkins_15.png)

10. 配置 Slack 通知

     Jenkins 项目自动构建完成后，需要提供相应的反馈信息，以便确定项目是否构建成功，一般情况下，可以通过邮件系统来通知。

     在团队中，项目的构建信息需要与团队成员共享，以便及时了解项目的运行状态。当然，邮件系统也能满足共享功能，但归类功能比较薄弱，此处引入 [Slack](https://slack.com) 来共享项目运行状态。

     首先，在 Slack 网站 App Directory 页面，搜索 Jenkins CI 并获取 Slack Token：

     ![](./img/jenkins_16.png)

     在 Jenkins 下新建全局凭据，添加 Slack Token ，如下图所示：

     > 凭据 => 系统 => 全局凭据

     ![](./img/jenkins_17.png)

     Jenkins 启用 Slack 通知机制，需要在插件管理中安装<code>Slack Notification Plugin</code>，并如下配置：

     <img class="zoomable" src="./img/jenkins_18.png" width="100%" />

     当然也可以添加自定义通知消息，如下图：

     ![](./img/jenkins_19.png)

     至此构建完成时，便会发送构建相关信息通知到 Slack 对应的频道。

## 参考链接

- [Setup Jenkins on CentOS](https://medium.com/appgambit/setup-jenkins-on-centos-with-docker-for-selenium-b7dba07b9ffa)

- [Integrating Jenkins with Slack Notifications](https://medium.com/appgambit/integrating-jenkins-with-slack-notifications-4f14d1ce9c7a)

- [github提示Permission denied (publickey)，如何才能解决？](https://www.zhihu.com/question/21402411)

- [服务器上的 Git - 生成 SSH 公钥](https://git-scm.com/book/zh/v1/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)

- [jenkins - npm command not found error](https://stackoverflow.com/questions/40495711/wedriverio-jenkins-npm-command-not-found-error)

- [Create A Continuous Integration Pipeline With GitLab And Jenkins](https://docs.bitnami.com/azure/how-to/create-ci-pipeline/)

- [Triggering a Jenkins build from a push to Github](https://medium.com/@marc_best/trigger-a-jenkins-build-from-a-github-push-b922468ef1ae)


- [Jenkins打造强大的前端自动化工作流](https://juejin.im/post/5ad1980e6fb9a028c42ea1be)

- [Jenkins 自动化部署实践](https://juejin.im/post/5c1a3282f265da61764ad51a)
