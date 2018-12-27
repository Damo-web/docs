# 虚拟DOM

> 在现代web前端框架中，虚拟DOM是一个不可避免谈论的话题。初识虚拟DOM，会对它非常好奇，但大部分人可能只停留在框架使用层面，对其diff过程不太清楚。本栏目旨在实现类mpVue类的跨端平台简易版本，会持续进行文档记录。而首当其冲，需要去了解Vue2.0+版本背后，虚拟DOM的运行机制及原理。

当翻阅Vue的源码，在其[github](https://github.com/vuejs/vue)上dev分支vue/src/core/vdom/patch.js目录下，注明了Vue有关虚拟DOM的diff算法是借鉴[Snabbdom](https://github.com/snabbdom/snabbdom)这个开源库来实现的。
下述文档会就Snabbdom的diff算法进行源码层面的分析和解读。

```javascript
/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */
```

## 简介

虚拟DOM本质是真实DOM抽象化，实质是用 JS 对象的方式来模拟真实的 DOM及节点。大体如下：

![](./img/vdom_1.png)