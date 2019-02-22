# Template Compiler

> 上篇粗略探讨了 Vue Loader 是如何解析 .vue 文件的，但没深究其编译原理，其实 pitch 函数中对 template 和 style 的编译都是依赖 @vue/ component-compiler-utils 这个 npm 包来实现的。在这个篇目中，将探究下 template 编译的实现。

## Template Engine

在我们深入模板编译前，先简单回溯下模板引擎的演变历史。

传统的模板引擎一般基于 String，辅以定界符（{{、<?等），输出字符串。Web 模板引擎一般基于 DOM，辅以定界符（{{、<%、缩进、<等），只输出 HTML/XML。可见，Web 模板引擎与传统模板引擎的不同之处，只是输出结果。

Web 模板引擎众多，[ejs](https://github.com/tj/ejs)、[pug](https://pugjs.org/api/getting-started.html)及[handlebars](http://handlebarsjs.com/)是其中杰出的代表，示例代码如下：

```javascript
//ejs的定界符即为<% 及 %>
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>

//pug的定界符即为缩进
#container.col
  if youAreUsingPug
    p You are amazing
  else
    p Get on it!

//handlebars的定界符即为{{ 及 }}
<div class="post">
  <h1>{{app}}</h1>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</div>

```

[Vue 模板引擎](https://vuejs.org/)与上述模板引擎有诸多共同之处，需要注意的是：

- 定界符只为 HTML tag 上的 **<** 及 **/>**

- 得益于指令系统的引入，避免了 HTML 标签与模板表达式的混入与嵌套

而这两点改进使得 Vue 的模板非常接近原生 HTML，书写体验几乎一致。

```html
<!-- vue -->
<div class="entry">
  <span>{{app}}</span>
  <span v-if="isShow">
    vue demo!
  </span>
  <span v-for="(item,index) in items" :key="index">
    {{item}}
  </span>
</div>
```

## Web Template

Web 模板引擎的实质：输入数据，通过模板字符串，输出 HTML/XML。模块编译即指输入数据后生成的模板字符串 parse 和 compile 这一过程。

模板编译的实现通常有下列方法：

1. template 解析为 AST（Abstract Syntax Tree），再编译至 DSL（Domain Specific Language）

2. template 通过正则进行匹配替换生成 DSL

3. template 通过格式化的 HTML 函数进行字符串拼接生成 DSL

第二种方案会出现很多边缘情况，处理起来容易遗漏，程序健壮性不强；第三种方案，格式化的 HTML 函数拼接的过程极为繁琐，并且扩展性不强。而第一种方案，解析及编译的过程虽然繁琐，但 AST 抽象度较高，扩展性强，跨平台可行度高，下述文档皆以此种方案为准。

## Template Parse

Web 模板解析的本质：类 HTML 的 Tree 结构解析至 AST 的过程。

不同的 Web 模板引擎具有不同的模板解析器，但成熟的模板引擎通常具备：

- expression(表达式)

- loop(循环)

- condition（判断）

关于 Web 模板引擎的解析过程，可以参阅：[htmlparser2](https://github.com/fb55/htmlparser2)、[Pure-JavaScript-HTML5-Parser](https://github.com/blowsie/Pure-JavaScript-HTML5-Parser)及[vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme)这三个库。

## Template Compile

Web 模板编译的本质：解析后的 AST 编译至 XML/HTML 的过程。

Web 模板编译时，需要对生成的 AST 对象进行递归处理，倘若解析前的模板不包含 expression、loop 及 condition 等选项，可以不做额外处理，直接返回当前模板即可；倘若解析前的模板包含 expression、loop 及 condition 等选项，需要对包含特定选项的类 HTML 元素进行额外处理，生成对应的 DSL。

## Vue Template Compiler

上面陈述了 Web 模板编译的大致流程，现以 Vue Template 为案例做详细说明，Vue的文件结构大致如下：

```vue
<template>
  <div class="red">
    {{msg}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello loader!"
    };
  }
};
</script>

<style scoped>
.red {
  color: #FB966E;
}
</style>
```

Vue Template 通常会内置表达式及指令，在浏览器并不能直接运行，而模板编译器就是解决这一问题而生。本文相关代码来源于 Vue 的 packages 文件夹下[vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler)。

Vue 的模板编译过程主要分为三个步骤：

**1. parseComponent（解析组件）**

该函数用以解析 .vue 文件的代码，解析后的代码如下：

```javascript
{ template:
   { type: 'template',
     content: '\n<div class="red">\n  {{msg}}\n</div>\n',
     start: 10,
     attrs: {},
     end: 52
    },
  script:
   { type: 'script',
     content:
      '//\n//\n//\n//\n//\n//\n\nexport default {\n  data() {\n    return {\n      msg: "hello loader!"\n    };\n  }\n};\n',
     start: 73,
     attrs: {},
     end: 156
    },
  styles:
   [ { type: 'style',
       content:
        '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.red {\n  color: #FB966E;\n}\n',
       start: 181,
       attrs: [Object],
       scoped: true,
       end: 209
    } ],
  customBlocks: []
}
```

**2. compile（编译至抽象语法树）**

该函数用以生成抽象语法树，上述 template 解析后的AST如下：

```javascript
{
  "type": 1,
  "tag": "div",
  "attrsList": [],
  "attrsMap": {
    "class": "red"
  },
  "children": [{
    "type": 2,
    "expression": "\"\\n  \"+_s(msg)+\"\\n\"",
    "tokens": ["\n  ", {
      "@binding": "msg"
    }, "\n"],
    "text": "\n  {{msg}}\n",
    "static": false
  }],
  "plain": false,
  "staticClass": "\"red\"",
  "static": false,
  "staticRoot": false
}
```

**3. compileToFunctions（转译为渲染函数）**

该函数用以生成渲染函数。

```javascript
{
  render: function(){
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", {
      staticClass: "red"
    }, [ _vm._v(_vm._s(_vm.msg))])
  },
  staticRenderFns:[]
}
```
