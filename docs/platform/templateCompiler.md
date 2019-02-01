# Template Compiler

> 上篇粗略探讨了 Vue Loader 是如何解析 .vue 文件的，但没深究其编译原理，其实 pitch 函数中对 template 和 style 的编译都是依赖 @vue/ component-compiler-utils 这个npm包来实现的。在这个篇目中，将探究下 template编译的实现。

## Vue Template Compiler

Vue 的 template 模板，浏览器并不能识别，而模板编译器就是解决这一问题而生。本文代码来源于 Vue 的 packages 文件夹下[vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler)部分。

Vue 的模板编译过程主要分为三个步骤：

**1. parseComponent（解析组件）**

**2. compile（编译至抽象语法树）**

**3. compileToFunctions（转译为渲染函数）**

- parseComponent

- compile

- compileToFunctions