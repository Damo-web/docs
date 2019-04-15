# ESLint

> 本篇目聚焦于前端工程化中 JS 代码规范问题，主要涉及 ES Module 及 Vue SFC 编码规范。

## 前言

  随着前端项目体积的增长，新人的融入，代码风格越来越多变，这造成了团队协作上的效率显著下降，也提升了人员间的沟通成本。考虑到历史遗留成本及人员适应度，一份具有强约束而渐进式的规范呼之欲出。

  因 JSHint 和 JSLint 不可配置性，ESLint 的可插拔、可定制、可渐进成为了最佳选择。

  ESLint 只需一次配置，能极大保障代码风格的统一，减少错误代码的产出率，提升团队协作效率。

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
npm install eslint -D

# init eslint
./node_modules/eslint/bin/eslint.js --init 

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

```javascript
// .eslintrc.js
// "off" or 0   - 关闭规则
// "warn" or 1  - 提醒规则，不退出代码
// "error" or 2 - 错误规则，退出代码
rules: {
  ...
  // https://eslint.org/docs/rules/object-shorthand
  "object-shorthand": 0,  
  // https://vuejs.github.io/eslint-plugin-vue/rules/require-v-for-key.html
  "vue/require-v-for-key": "off",
  ...
}
```

2. 内联忽略

   - *.js  文件

   详情参阅：[Disabling Rules with Inline Comments](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)

   ```javascript
   // 顶部注释规则，全部忽略
   /* eslint-disable */
   ...
   // 行内注释规则，指定规则
   /* eslint-disable no-new */
   new Vue({
     el: '#app',
     template: '<App/>',
     components: { App }
   })
   ```

   - *.vue 文件

   详情参阅：[vue/comment-directive](https://eslint.vuejs.org/rules/comment-directive.html)

   ```vue
    <template>
      <!-- eslint-disable -->
      <div id="app"></div>
    </template>
    
    <script>
      /* eslint-disable */
      export default {
        name: 'app'
      }
    </script>
   ```

3. 文件忽略

  .eslintrc.js 同级目录下新建 .eslintignore文件，配置如下：
  ```json
  node_modules
  build/*.js
  config/*.js
  src/assets/**
  static
  ```

4. 完全禁用

   下述三种方法择其一即可：

   - 清空 .eslintrc.js 所有规则

   - 追加 .eslintignore 所有文件 ** 配置

   - 移除 webpack 中的 eslint-loader

## Git Hooks

  按上述步骤操作即可完成 ESLint 配置，接下来通过 npm scripts 和 git hooks 来进一步优化 ESLint 的工作流： 

  1. npm script

  配置如下 scripts ，可以通过 npm 执行简单的命令即可完成 lint 和 fix 

  ```javascript
  // package.json
  "scripts": {
    "eslint": "./node_modules/eslint/bin/eslint.js",
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --ext .js,.vue src --fix",
  } 
  ```

  2. husky

  通常 lint 的校验会处于 CI 阶段，但 CI 阶段一般任务较重，把 lint 放在本地会极大优化代码 review 和 commit 的效率。常见做法是使用 [husky](https://github.com/typicode/husky) 在本地提交之前进行 lint，即在 git commit 之前通过 git pre-commit hook 来进行代码校验工作。

  ```javascript
  // package.json
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  }
  ```

  3. lint-staged

  上述优化完成之后还存在一个问题，lint 依旧会校验 src 下面的所有 .js文件和 .vue 文件，当项目增大后，校验的耗时也会增长，同时会涉及校验他人代码的问题。倘若只针对本次提交文件进行校验，就能有效避免上述问题，而 [lint-staged](https://github.com/okonet/lint-staged)正是为此而生。

  ```javascript
  // package.json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
  ```

  4. commitlint

  上述三个步骤已完成 git hooks 主体流程，其实 git pre-commit hook阶段不仅仅可进行代码校验，还可以通过 commitlint 进行 git commit-msg 的校验，保持类似风格的 commit-msg 在团队中同样重要。

  ```javascript
  // npm i @commitlint/cli -D
  // npm i @commitlint/config-conventional -D

  // .commitlintrc.js
  module.exports = {
    extends: ["@commitlint/config-conventional"],
  }
  // package.json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
  +   "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
  
  ```

  5. prettier

  因 ESLint 并不处理代码格式问题，而团队中代码格式问题也需进行统一，[Prettier](https://prettier.io/) 这一工具便可解决此类问题。

  ```javascript
  // .prettierrc 
  {
    "trailingComma": "none",
    "tabWidth": 2,
    "useTabs": false,
    "semi": true,
    "singleQuote": false,
    "bracketSpacing": false
  }
  ```

  ```javascript
  // .eslintrc.js
  // required to lint *.vue files
  plugins: [
    "vue",
  + "prettier"
  ],
  // https://github.com/prettier/eslint-config-prettier
  extends: [
    "plugin:vue/base",
  + "plugin:prettier/recommended",
  + "prettier/vue"
  ]
  ```

  ```javascript
  // package.json
  "lint-staged": {
    "src/**/*.{js,vue}": [
  +   "prettier --write",
      "eslint --fix",
      "git add"
    ]
  }
  ```

## VSCode支持

团队中，使用相同的编辑器，可以共享插件和代码块资源，有利于保证代码风格的统一性。

常用的插件如下所示：

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

- [VScode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- [Prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  

## 风格指南

ESLint 与 Prettier 只是辅助团队统一代码风格的工具，它们并不是万能的，终究有能力不可达的区域，一份优秀的团队风格指南才是团队代码的风向标。

JS 和 Vue 社区关于代码风格指南最佳实践如下：

- ES Module 风格指南

  - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

  - [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

- Vue SFC 风格指南

  - [Vue Style Guide](https://cn.vuejs.org/v2/style-guide/)

  - [eslint-plugin-vue](https://eslint.vuejs.org/rules/)

可参阅上述最佳实践，定制一份契合自己团队的代码风格指南。

## 参考链接

- [ESLint Rules](https://eslint.org/docs/rules/)

- [Vue Style Guide](https://cn.vuejs.org/v2/style-guide/)

- [eslint-plugin-vue](https://eslint.vuejs.org/rules/)

- [ESLint 配置](https://www.jianshu.com/p/bf0ffe8e615a)

- [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)

- [eslint-prettier-vue-workflow](https://medium.com/@doppelmutzi/eslint-prettier-vue-workflow-46a3cf54332f)

- [commit-message-guideline](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)

- [Prettier](https://prettier.io/)

- [Husky](https://github.com/typicode/husky)

- [Lint-staged](https://github.com/okonet/lint-staged)

- [Commitlint](https://conventional-changelog.github.io/commitlint/#/)
