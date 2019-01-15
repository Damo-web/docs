# Vue Loader

> Vue Loader 是一个 webpack 的 loader，它允许以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。本文将探究 .vue 文件中template、script、style及自定义块是如何解析为 Vue 组件对象，并在浏览器端运行。

## Webpack

众所周知，现代前端工程化离不开webpack，从本质上来说，**webpack 是一个现代 JavaScript 应用程序的静态模块打包器**。

![](./img/vloader_1.png)

.vue 文件的解析及运行同样离不开webpack，下面将从vue-loader的loader与plugin两个方面来解析vue单文件组件系统的实现过程。

::: tip
需要值得注意的是，**本文档基于webpack4.0+版本来解读vue-loader**。webpack4.0+版本基于原有版本进行大幅度升级，原有webpack拆分为webpack、webpack-dev-server、webpack-cli三个npm包，配置层面也更加倾向于零配置，当然loader与plugin的api层面也有变化
:::

## Loader

首先，webpack的loader到底是什么？

[官方文档](https://webpack.docschina.org/api/loaders/)中这么进行解读的：**所谓 loader 只是一个导出为函数的 JavaScript 模块**。

下面我们来看一下最简单的loader实现：

1. 配置package.json
```json
  "scripts": {
    "serve": "webpack-dev-server --config example/webpack.config.js --inline --hot"
  }
```


2. 配置webpack.config.js

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './main.damo'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  devServer: {
    contentBase: __dirname
  },
  module: {
    rules:[
      {
        test: /\.damo$/,
        loader: 'test-loader'
      }
    ]
  },
  resolveLoader: {
    alias: {
      'test-loader': require.resolve('../lib')
    }
  }
}

```

3. 配置loader

```javascript

module.exports = function (source) {
  let code = `
    let style = document.createElement("style");
    style.innerText = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `
  return code;
}

```

从上述案例可以看出，loader 接受 source 并返回 code 。而source 便是 .damo 文件中字符串化的代码，code 是对 source 加工处理后的字符串。为此，大致上可以认为，loader 接受 String 并返回 String。

vue-loader 也是类似的机制，相对于简单的loader，它利用插件解析了 .vue 文件中的template 、style 、script 三个模块，并把解析后的文件利用 vue 组件生成函数构建为组件导出，从来实现了在浏览器端运行。代码如下：

```javascript
  //templateImport、scriptImport、stylesCode分别为 .vue 文件中各模块导出的js模块

    let code = `
  ${templateImport}
  ${scriptImport}
  ${stylesCode}

  /* normalize component */
  import normalizer from ${stringifyRequest(`!${componentNormalizerPath}`)}
  var component = normalizer(
    script,
    render,
    staticRenderFns,
    ${hasFunctional ? `true` : `false`},
    ${/injectStyles/.test(stylesCode) ? `injectStyles` : `null`},
    ${hasScoped ? JSON.stringify(id) : `null`},
    ${isServer ? JSON.stringify(hash(request)) : `null`}
    ${isShadow ? `,true` : ``}
  )
    `.trim() + `\n`

  // Expose filename. This is used by the devtools and Vue runtime warnings.
  code += `\ncomponent.options.__file = ${
    JSON.stringify(filename)
  }`

  code += `\nexport default component.exports`

```

::: tip 
vue-loader 的loader模块并没有实现解析 .vue 文件中的template 、style 、script 三个模块功能，解析过程是通过 plugin 来实现的
:::

## Plugin

[官方文档](https://webpack.docschina.org/api/plugins/)中这么进行解读的：**插件是 webpack 生态系统的重要组成部分，为社区用户提供了一种强大方式来直接触及 webpack 的编译过程。插件能够钩入到在每个编译中触发的所有关键事件。**

倘若开发一个简单loader，并不需要引入 plugin。但当需要解析特定结构下的单文件时，因loader 不具备控制 webpack 的编译过程，plugin 将不可或缺。

下面演示了一个简单 plugin 引入的大致过程：

1. 配置webpack.config.js

```javascript

const TestLoaderPlugin = require('../lib/plugin')

module.exports = {
  // ... 这里是其他配置 ...
  plugins:[
    new TestLoaderPlugin(
      ()=>{
        console.log('run')
      },
      ()=>{
        console.log('failed')
      }
    )
  ]
}

```

2. 配置plugin

```javascript

class TestLoaderPlugin {
  constructor(doneCb,failCb){
    this.doneCb = doneCb;
    this.failCb = failCb;
  }
  //webpack 初次加载完此插件后执行，只会在 webpack 启动的时候被执行一次
  apply(compiler){
    compiler.hooks.done.tap('TestLoaderPlugin', (compiler) => {
      this.doneCb();
    });  
    compiler.hooks.failed.tap('TestLoaderPlugin', (compiler) => {
      this.failCb();
    }); 
  }
}

module.exports = TestLoaderPlugin

```

通常来说，plugin 是 webpack 的核心功能，用于解决 loader 无法实现的事。

## Flow



