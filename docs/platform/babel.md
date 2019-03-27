# Babel

> Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

## workflow

Babel 的工作步骤分为**解析**、**转换** 及 **生成** 三个阶段，其流程如下图所示：

![](./img/babel_flow.svg)

- **解析阶段**

  **Babel 解析接受源码并输出 AST**。这一阶段分为两个步骤： [词法解析（Lexical analysis）](https://en.wikipedia.org/wiki/Lexical_analysis)与[语法解析（Syntactic Analysis）](https://en.wikipedia.org/wiki/Parsing)。

  示例源码如下：

  ```javascript
  function add(num) {
    return num + 1;
  }
  ```

  - **词法分析**

  词法分析把字符串形式的代码转换为 令牌（tokens） 流。

  ```javascript
  // 词法分析主要记录 type、value、start、end、loc 这五个属性值
  // ====================================================
  // type指代节点的类型，为包含一组属性的对象
  // ====================================================
  // value指代该节点的值，包含符号、空格、字幕、数字等
  // ====================================================
  // start、end指代该节点在原始代码中的位置，仅为数字
  // ====================================================
  // loc（line of code）指代该节点的行号，该对象示例如下：
  // start: {line: 1,column: 0},end: {line: 3,column: 1}
  // ====================================================

  tokens:[
    ...
    { type: { ... }, value: 'num', start: 0, end: 3, loc: { ... } },
    { type: { ... }, value: '+', start: 4, end: 5, loc: { ... } },
    { type: { ... }, value: '1', start: 6, end: 7, loc: { ... } },
    ...
  ]
  ```

  - **语法分析**

  语法分析把令牌流转换成 AST 。词法分析后的令牌流，信息表述性较差，需要借助语法对其进行加工组装（ program ），以使生成的 AST 易于操作。

  ```javascript
  // body数组下包含生成的 AST 的细节信息
  program: {
    type: "Program",
    start: 0,
    end: 39,
    loc: {
      start: {
        line: 1,
        column: 0
      },
      end: {
        line: 3,
        column: 1
      }
    },
    sourceType: "module",
    body: [...]
  } 
  ```
  
- **转换阶段**

  **Babel 转换接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作**。 这是 Babel 或是其他编译器中最复杂的过程，同时也是插件将要介入工作的部分。

  这一阶段将在 Plugin 部分做详细说明，示例 AST 如下：

  ```javascript
  // tokens 需要在 babylon6 或 babylon 下才会生成
  // babylon7 下只生成对应的 program 用于 AST 操作
  // 具体细节可在 https://astexplorer.net/ 进行体验
  {
    "type": "File",
    "start": 0,
    "end": 39,
    "loc": {...},
    "program": {
      "type": "Program",
      "start": 0,
      "end": 39,
      "loc": {...},
      "sourceType": "module",
      "body": [...],
      "directives": [...]
    },
    "comments": [...],
    "tokens": [
      {
        "type": {...},
        "value": "function",
        "start": 0,
        "end": 8,
        "loc": {...}
      }
      ...
    ]
  }
  ```

- **生成阶段**

  **Babel 生成把原始或转换后的 AST 构建为字符串形式的代码，并创建源码映射（source maps）**。

  这一阶段主要操作是遍历 AST 并根据其拼接对应字符串，最终生成目标代码。

## API



## Plugin