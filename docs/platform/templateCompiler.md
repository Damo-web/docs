# Template Compiler

> 上篇粗略探讨了 Vue Loader 是如何解析 .vue 文件的，但没深究其编译原理，其实 pitch 函数中对 template 和 style 的编译都是依赖 @vue/ component-compiler-utils 这个npm包来实现的。在这个篇目中，将探究下 template编译的实现。

