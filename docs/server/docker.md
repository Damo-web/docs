# Docker

> Docker 是一个开源的 Linux 应用容器引擎，提供简单易用的接口来操作应用容器。应用容器采用沙箱机制，运行在同一个 Linux 内核上，实现了应用之间的资源隔离与权限控制，可以部署到任何流行的 Linux 机器上。

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
  





