# Template Compiler

> 上篇粗略探讨了 Vue Loader 是如何解析 .vue 文件的，但没深究其编译原理，其实 pitch 函数中对 template 和 style 的编译都是依赖 @vue/ component-compiler-utils 这个npm包来实现的。在这个篇目中，将探究下 template编译的实现。


## Template Engine

在我们深入模板编译前，先简单回溯下模板引擎的演变历史。

传统的模板引擎一般基于String，辅以定界符（{{、<?等），输出字符串。

Web模板引擎一般基于DOM，辅以定界符（{{、<%、缩进、<等），只输出HTML/XML。

可见，Web模板引擎与传统模板引擎的不同之处，只是输出结果。

Web模板引擎众多，[ejs](https://github.com/tj/ejs)、[pug](https://pugjs.org/api/getting-started.html)及[handlebars](http://handlebarsjs.com/)是其中杰出的代表，示例代码如下：

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

[Vue模板引擎](https://vuejs.org/)与上述模板引擎有诸多共同之处，需要注意的是：

- 定界符只为HTML tag上的 **<** 及 **/>**

- 得益于指令系统的引入，避免了HTML标签与模板表达式的混入与嵌套

而这两点，使得Vue的模板和原生HTML的书写体验几乎一致。

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

## Vue Template Compiler

Vue 的 template 模板，浏览器并不能识别，而模板编译器就是解决这一问题而生。本文代码来源于 Vue 的 packages 文件夹下[vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler)部分。

Vue 的模板编译过程主要分为三个步骤：

**1. parseComponent（解析组件）**

**2. compile（编译至抽象语法树）**

**3. compileToFunctions（转译为渲染函数）**

模板编译中的详情如下：

- parseComponent

  该函数用以解析 .vue 文件的模板代码。

- compile

  该函数用以生成抽象语法树。

- compileToFunctions

  该函数用以生成渲染函数。
