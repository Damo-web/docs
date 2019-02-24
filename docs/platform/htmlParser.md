# HTML Parser

> 有关 Web 模板引擎的解析过程，在上个篇目中一带而过，在这个篇目里，我们将从代码层面深入理解 HTML Parser的过程。

## HTML5 Parser

JQuery的作者 John Resig 曾经在2008年写过 [htmlparser](https://johnresig.com/files/htmlparser.js)，社区中很多HTML Parser库都借鉴了其的思想，并在其基础上进行了改进。下面，我们将以此为基础，发散出去，了解其背后代码层的实现。

