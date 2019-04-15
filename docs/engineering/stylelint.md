# StyleLint

> 本篇目聚焦于前端工程化中 CSS 代码规范问题，主要涉及 CSS PreProcessor 及 Vue SFC 编码规范。

## 前言

随着前端项目体积的增长，新人的融入，代码风格越来越多变，这造成了团队协作上的效率显著下降，也提升了人员间的沟通成本。考虑到历史遗留成本及人员适应度，一份具有强约束而渐进式的规范呼之欲出。

关于 JS 代码规范问题可以通过配置 ESLint 来检测，HTML 代码问题可以通过 Prettier 和 ESLint Plugin 来检测，而项目中 CSS 代码问题也需要检测修复，此时可引入 StyleLint 来解决。

StyleLint 与 ESLint 大同小异，具有可插拔、可定制、可渐进的特性。

## 配置 StyleLint

StyleLint 安装流程如下：

```bash
# npm install
npm install stylelint -D

# stylelint 
./node_modules/stylelint/bin/stylelint.js

# stylelint config instruction
Path to a specific configuration file (JSON, YAML, or CommonJS), 
or the name of a module in node_modules that points to one. 
If no --config argument is provided, 
stylelint will search for configuration files in the following places, in this order:
  - a stylelint property in package.json
  - a .stylelintrc file (with or without filename extension:
    .json, .yaml, .yml, and .js are available)
  - a stylelint.config.js file exporting a JS object
The search will begin in the working directory and move up the directory tree 
until a configuration file is found.

# config stylelint in .stylelintrc.js
```

针对于 Vue 项目的 StyleLint 配置大致如下：

```javascript
// .stylelintrc.js
module.exports = {
  // 标准(standard)配置，如果您希望 stylelint 强制执行风格约定
  // 扩展规则入口，继承一类规则
  extends: ["stylelint-config-standard"],
  // 自定义规则入口，选择 stylelint 下的 rule
  rules: {
  rules: {
    ...
    // no-vendor-prefix
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    // https://stylelint.docschina.org/user-guide/rules/color-no-invalid-hex/
    "color-no-invalid-hex": true,
    ...
  }
}
```

Webpack 中的相关配置如下：

```javascript
// npm install
npm install stylelint-webpack-plugin -D

// webpack.config.js
const StyleLintPlugin = require('stylelint-webpack-plugin');
module.exports = {
  ...
  plugins: [
    ...
    new StyleLintPlugin({
      files: ['src/**/*.{vue,html,css,less,scss}'],
    })
    ...
  ]
  ...
}
```

## 禁用 StyleLint

禁用 StyleLint 相关规则有四种形式：

1. 规则禁用

```javascript
// .stylelintrc.js
// null or "never"   - 从不生效，关闭规则
// true or "always"  - 永远生效，错误规则，退出代码
// ...
rules: {
  ...
  "color-no-invalid-hex": null,
  ...
}
```

2. 内联忽略

   - *.css|less|scss 文件

   详情参阅：[Turning rules off from within your CSS](https://stylelint.io/user-guide/configuration/#turning-rules-off-from-within-your-css)
    ```less
    // index.less
    // 顶部注释规则，全部忽略
    /* stylelint-disable */
    ...
    // 行内注释规则，关闭指定规则
    .demo { /* stylelint-disable-line */
      /* stylelint-disable-next-line declaration-no-important */
      display: flex !important;
    }
   ```

   - *.vue 文件

    下列两处并不可同时使用  /* stylelint-disable */

    ```vue
      <template>
        <div id="app">
          <div 
            class="demo" 
            style="/* stylelint-disable */ display: -webkit-flex;">
          </div>
        </div>
      </template>
      
      <style>
      /* stylelint-disable */
      #app {
        display: flex;
      }
      </style>
    ```

    :::tip 提示

    stylelint 只是静态代码检测工具，并不支持 Vue 中 v-bind:style 属性。

    :::

   - CSS-in-JS

   ```javascript
   import styled from 'styled-components';

   const Title = styled.h1`
    /* stylelint-disable */
    font-size:   1.5em;
    text-align:  center;
   `;
   ```
3. 文件忽略

    - .stylelintrc.js 下配置 ignoreFiles ，配置如下：
    
    ```javascript
    // 请注意，这不是忽略大量文件的有效方法。 
    // 如果要有效地忽略大量文件，请使用.stylelintignore或调整文件glob
    rules: {
      ...
      ignoreFiles: "src/assets/**",
      ...
    }
    ```

    - .stylelintrc.js 同级目录下新建 .stylelintignore 文件，配置如下：
    
    ```json
    dist/src/assets/reset.less
    *.min.css
    ```

  4. 完全禁用

   下述三种方法择其一即可：

   - 清空 .stylelintrc.js 所有规则

   - 追加 .stylelintignore 所有文件 ** 配置

   - 移除 webpack 中的 stylelint-webpack-plugin

## Git Hooks

  按上述步骤操作即可完成 StyleLint 配置，接下来通过 npm scripts 和 git hooks 来进一步优化 StyleLint 的工作流： 

  1. npm script

  配置如下 scripts ，可以通过 npm 执行简单的命令即可完成 lint 和 fix 

  ```javascript
  // package.json
  "scripts": {
    "stylelint": "./node_modules/stylelint/bin/stylelint.js",
    "lint": "stylelint src/**/*.{css,less,scss,vue}",
    "lint:fix": "stylelint src/**/*.{css,less,scss,vue} --fix",
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

  上述优化完成之后还存在一个问题，lint 依旧会校验 src 下面的所有 .css|less|scss 文件和 .vue 文件，当项目增大后，校验的耗时也会增长，同时会涉及校验他人代码的问题。倘若只针对本次提交文件进行校验，就能有效避免上述问题，而 [lint-staged](https://github.com/okonet/lint-staged)正是为此而生。

  ```javascript
  // package.json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{css,less,scss,vue}": [
      "stylelint --fix",
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
    "src/**/*.{css,less,scss,vue}": [
      "stylelint --fix",
      "git add"
    ]
  }
  
  ```

  5. prettier

  因 StyleLint 并不处理代码格式问题，而团队中代码格式问题也需进行统一，[Prettier](https://prettier.io/) 这一工具便可解决此类问题。

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
  // package.json
  "lint-staged": {
    "src/**/*.{css,less,scss,vue}": [
  +   "prettier --write",
      "stylelint --fix",
      "git add"
    ]
  }
  ```

## VSCode 支持

团队中，使用相同的编辑器，可以共享插件和代码块资源，有利于保证代码风格的统一性。

常用的插件如下所示：

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

- [VScode-stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)

- [Prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 风格指南

CSS 社区关于代码风格指南最佳实践如下：

- Airbnb 风格指南

  - [Airbnb CSS Style Guide](https://github.com/airbnb/css)

- Github 风格指南

  - [stylelint-config-primer](https://github.com/primer/stylelint-config-primer)

可参阅上述最佳实践，定制一份契合自己团队的代码风格指南。

## 参考链接

- [StyleLint CLI](https://stylelint.io/user-guide/cli/)

- [Lint your CSS with StyleLint](https://medium.com/vunamhung/lint-your-css-with-stylelint-e3502afef77c)

- [Lint Vue With StyleLint](https://vue-loader.vuejs.org/guide/linting.html#eslint)

- [How to create your own shared esLint, prettier and stylelint configuration](https://medium.com/@natterstefan/how-to-create-your-own-shared-eslint-prettier-and-stylelint-configuration-3930dd764de3)

- [Stylelint in vue](https://juejin.im/post/5a2c19d351882531ba10df83)

- [Integrate Stylelint Into Your Workflow For Better CSS ](https://medium.com/@jake_bresnehan/integrate-stylelint-into-your-workflow-for-better-css-236a7891ddc9)

- [Announcing production-ready linting for styled-components](https://medium.com/styled-components/announcing-production-ready-linting-for-styled-components-58adcdc4a97)

- [StyleLint Rules](https://stylelint.docschina.org/user-guide/rules/)

- [stylelint 开发小结](https://zhuanlan.zhihu.com/p/54137589)
