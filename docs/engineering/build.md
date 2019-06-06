# Build Optimization

> 之前文章介绍了 CI / CD 相关概念及主流工具，利用此类工具能便捷地进行持续集成及发布，但构建自动化并不意味着构建流程的结束，恰好是构建优化的开始。

## 缓存
 
缓存（ Cache ）是构建流程中必须面对的话题。

在持续集成及发布中，缓存是一把双刃剑，一方面，想尽可能的利用缓存，提升构建速度；一方面，想废弃缓存，确保构建应用及时更新。

以 Node 为例，在 build 之前，需要利用 <code>node_modules</code> 来提升安装包的速度，而在 <code>package.json</code> 发生变更时，需要清空缓存，安装新增包或更新变更包，确保应用如期运行。




## 工作流


## 参考链接

- [The ultimate DroneCI caching guide](https://laszlo.cloud/the-ultimate-droneci-caching-guide)

- [Making Drone Builds 10 Times Faster!](https://underthehood.meltwater.com/blog/2019/04/10/making-drone-builds-10-times-faster/)

- [如何使用 docker 高效部署前端应用](https://shanyue.tech/post/deploy-frontend-with-docker/)

- [Drone将VUE项目持续部署到阿里云OSS](http://trylife.cn/drone-ci/vue-continuous-deploy-to-aliyun-oss/)

- [容器环境持续集成优化，Drone CI 提速 500%](https://avnpc.com/pages/speed-up-drone-ci-workflow)

- [npm install if package.json was modified](https://stackoverflow.com/questions/52466740/npm-install-if-package-json-was-modified)

- [Git - show file diff between HEAD and initial (first) version](https://stackoverflow.com/questions/41371090/git-show-file-diff-between-head-and-initial-first-version)

- [Finding diff between current and last version?](https://stackoverflow.com/questions/9903541/finding-diff-between-current-and-last-version)