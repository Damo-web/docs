# Vue Loader

> Vue Loader 是一个 webpack 的 loader，它允许以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。本文将探究 .vue 文件中template、script、style及自定义块是如何解析为 Vue 组件对象，并在浏览器端运行。

## Webpack

众所周知，现代前端工程化离不开webpack，从本质上来说，webpack 是一个现代 JavaScript 应用程序的静态模块打包器。

![](./img/vloader_1.png)

.vue 文件的解析及运行同样离不开webpack，下面将从vue-loader的loader与plugin两个方面来解析Vue的单文件组件实现过程。

::: tip
需要值得注意的是，**本文档基于webpack4.0+版本来解读vue-loader**。webpack4.0+版本基于原有版本进行大幅度升级，原有webpack拆分为webpack、webpack-dev-server、webpack-cli三个npm包，配置层面也更加倾向于零配置，当然loader与plugin的api层面也发现些许变化
:::

