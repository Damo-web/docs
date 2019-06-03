# Travis CI

> 本篇目为 Travis CI 搭建指南，以静态博客为例，覆盖构建、发布及通知流程。

## 前言

Travis 是一个用 Ruby 语言开发的开源持续集成软件，仅适用于 Github，对于开源项目免费使用，其配置文件极其简单，语言支持度更广，是 Github 当下最成熟的 CI / CD 工具。

## 说明

[Travis CI](https://travis-ci.com/) 是容器化的 CI / CD 工具，通过简单配置根目录下 <code>.travis.yml</code>文件即可运行 CI / CD 服务。

## 流程图

![](./img/travis_1.png)

## 安装

可以通过 [travis-ci | signup](https://travis-ci.org/) 或 [github | marketplace](https://github.com/marketplace/travis-ci)来进行授权安装。

