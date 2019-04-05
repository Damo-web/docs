# PostCSS

> PostCSS 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查（lint） CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

## Workflow

PostCSS 的工作步骤分为**解析**、**转换** 及 **生成** 三个阶段，其流程如下图所示：

![](./img/postcss_flow.svg)

- **解析**

  **PostCSS 接受源码并输出 AST**。这一阶段分为两个步骤： [词法解析（Lexical analysis）](https://en.wikipedia.org/wiki/Lexical_analysis)与[语法解析（Syntactic Analysis）](https://en.wikipedia.org/wiki/Parsing)。

  示例源码如下：

  ```css
  .className { 
    color: #FFF;
  }
  ```

  - **词法分析**

  词法分析把字符串形式的代码转换为 令牌（tokens） 流。

  ```javascript
  tokens:[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
  ]
  ```



- **转换**

  **PostCSS 接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作，此转换通常借助插件来进行**。

- **生成**

  **PostCSS 把原始或转换后的 AST 构建为字符串形式的代码**。

## Autoprefixer


## Plugin


## Reference