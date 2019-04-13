# ESLint

> 本篇目聚焦于前端工程化中 JS 代码规范问题，主要涉及 ES Module 及 Vue SFC 编码规范。

## 前言

  随着前端项目体积的增长，新人的融入，代码风格越来越多变，这造成了团队协作上的效率显著下降，也提升了人员间的沟通成本。考虑到历史遗留成本及人员适应度，一份具有强约束而渐进式的规范呼之欲出。

  因 JSHint 和 JSLint 不可配置性，ESLint 的可插拔、可定制、可渐进成为了最佳选择。

## 规范须知

对 ESLint 规范需要做如下说明：

1. 规范并不应该包含代码格式相关规则，如需限制格式，可采用 Prettier 等工具

2. 不提倡对 lint 后的代码问题一键采用fix，过度依赖工具并不能提升自身对规范的认知，况且 fix 并不总是生效

3. 避免过度依赖其他团队提供的 Plugin ，各团队间的代码问题具有差异性

4. 规范旨在提供了一份团队化的 JS 和 Vue 风格指南，并在项目中进行落实推广

5. 遵循规范能够在工程中改善代码可读性，提高协作效率，同时可以规避错误代码，贴近社区最佳实践，提升应用性能

## 配置 ESLint

流行前端框架（React、Vue、Angular）的 CLI 中已经内置 ESLint，可查阅以下列表，在此不做赘述。

- React: [Create React App](https://facebook.github.io/create-react-app/docs/setting-up-your-editor#displaying-lint-output-in-the-editor)

- Vue: [Vue CLI](https://cli.vuejs.org/config/#eslint)

- Angular: [Angular CLI](https://angular.io/cli/lint)

ESLint 常规安装流程如下：

``` bash
# npm install
npm install -g eslint

# init eslint
eslint --init 

# choose eslint feture
? How would you like to use ESLint? To check syntax and find problems
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Where does your code run? Browser
? What format do you want your config file to be in? JavaScript

# config eslint in .eslintrc.js
```
针对于 Vue 项目的 ESLint 配置大致如下：

```javascript
// .eslintrc.js
module.exports = {
  // 多目录层级下都具有 eslintrc 的配置项，会导致配置项的叠加
  // 配置 root: true 会把 lint 限制下当前目录下
  root: true,
  // ESLint 允许你指定你想要支持的 JavaScript 语言选项
  parserOptions: {
    // ECMAScript 模块
    sourceType: "module",
    // eslint-plugin-vue 下使用 babel-eslint 解析器需如下配置
    // https://eslint.vuejs.org/user-guide/#usage
    parser: "babel-eslint"
  },
  // 环境变量
  env: {
    browser: true
  },
  // 第三方插件引用入口，可以省略包名的前缀 eslint-plugin-
  // https://eslint.vuejs.org/user-guide/#installation
  plugins: ["vue"],
  // 扩展规则入口，继承一类规则
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  // 自定义规则入口，选择 eslint 和 eslint-plugin-vue 下的 rule
  rules: {
    ...
    // https://eslint.org/docs/rules/object-shorthand
    "object-shorthand": 1,  
    // https://vuejs.github.io/eslint-plugin-vue/rules/require-v-for-key.html
    "vue/require-v-for-key": 1,
    ...
  }
}
```

Webpack 中的相关配置如下：

```javascript
// webpack.config.js
rules:[
  ...
  {
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    // check source files, not modified by other loaders
    enforce: 'pre',
    include: [resolve('src')],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  }
  ...
]
```

## 禁用 ESLint

禁用 ESLint 相关规则有四种形式：

1. 规则禁用



2. 内联忽略

3. 文件忽略

4. 完全禁用

## ES Module



## Vue SFC

## Prettier

## VSCode

## Snippet

## Husky

## 参考链接

- [ESLint 配置](https://www.jianshu.com/p/bf0ffe8e615a)