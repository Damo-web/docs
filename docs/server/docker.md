# Docker

> Docker 是一个开源的 Linux 应用容器引擎，提供简单易用的接口来操作应用容器。应用容器采用沙箱机制，运行在同一个 Linux 内核上，实现了应用之间的资源隔离与权限控制，可以快速地部署到任何流行的 Linux 机器上。

## 安装

macOS 下安装 Docker ，推荐使用 Homebrew 安装，整体流程如下：

- **安装 Homebrew**

  [Homebrew](https://brew.sh/) 是一个包管理器，用于安装 macOS 没有预装但你需要的 Unix 工具。

  Homebrew 的安装步骤如下：

  - 安装 <code>Command Line Tools for Xcode</code>

  ```bash
  xcode-select --install
  ```

  - 安装 <code>Homebrew</code>

  ```bash
  # install
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  # uninstall
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
  ```

  - 使用 <code>Homebrew</code>

  ```bash
  # install pkg
  brew install redis

  # without updating
  # Reference: https://github.com/Homebrew/brew/issues/1670
  HOMEBREW_NO_AUTO_UPDATE=1 brew install redis
  ```

  :::tip 提示

  使用 brew 更新及安装包时，推荐使用国内镜像源，以防下载过慢。

  :::

- **安装 Docker**

  Homebrew Cask 用来安装和管理 macOS 图形界面程序，而 Docker 便通过此工具来进行安装。

  ```bash
  # install dmg
  brew cask install docker

  # uninstall dmg
  brew cask uninstall docker
  ```

  在终端可通过命令可以检查安装后的 Docker 版本：

  ```bash
  # check docker
  $ docker -v
  Docker version 18.09.2, build 6247962

  # check docker-compose
  # https://docs.docker.com/compose/overview/
  $ docker-compose -v
  docker-compose version 1.23.2, build 1110ad01

  # check docker-machine
  # https://docs.docker.com/machine/overview/
  $ docker-machine -v
  docker-machine version 0.16.1, build cce350d7
  ```

## 常用命令

- docker

  更多命令可参阅：[Docker CLI (docker)](https://docs.docker.com/engine/reference/run/)

  - 下载镜像

  ```bash
  # download docker image
  # Reference : https://hub.docker.com/
  $ docker pull node
  ```

  - 获取镜像列表

  ```bash
  # list images
  $ docker image ls
  # image list
  REPOSITORY        TAG               IMAGE ID            CREATED             SIZE
  mongo             3.4               ad62612cfc71        3 weeks ago         425MB
  redis             4.0.6             1e70071f4af4        16 months ago       107MB
  ```

  - 获取容器列表

  ```bash
  # list containers
  $ docker ps
  # container list
  CONTAINER ID        IMAGE               COMMAND                CREATED              STATUS              PORTS               NAMES
  6d665a34f4f5        ubuntu:12.04        bash                   17 seconds ago       Up 16 seconds       3300-3310/tcp       webapp
  4d86fe3c8c50        redis:latest        /redis-server --dir    33 minutes ago       Up 33 minutes       6379/tcp            redis
  ```

  - 获取数据卷列表

  ```bash
  # list volumes
  $ docker volume list
  # volume list
  DRIVER          VOLUME NAME
  local           0d89bd5676305cff08f964a28d499f6d3ff13f7e4c3264022c646c61d1a01bf3
  local           0d854f16c00ff828ace09c21554ce3fba4ad74a32be2236be1dcc208b9e7929d
  local           0dca2c640b4ab7611bbdfa3a9513bd0e20ae1472e440ea83a96a4501a5052220
  ```

  - 运行容器

  ```bash
  # run container
  $ docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
  # example

  # run in container id
  # Longhand
  $ docker run 6d665a34f4f5 
  # Shorthand
  $ docker run 6d6

  # run in container name
  $ docker run webapp
  ```

  - 停止容器

  ```bash
  # stop container
  $ docker stop [OPTIONS] CONTAINER [CONTAINER...]

  # example
  $ docker stop 6d665a34f4f5 
  ```

  - 删除容器

  ```bash
  # delete container
  # stop container，then delete container
  $ docker rm [OPTIONS] CONTAINER [CONTAINER...]

  # example
  $ docker rm 6d665a34f4f5 
  ```

  - 进入容器执行命令

  ```bash
  # enter container
  $ docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

  # example
  $ docker exec -it docker_mongodb_1 bash
  $ root@6d665a34f4f5:/
  ```
