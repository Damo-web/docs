# Vuex

> Vuex 是只适用于 Vue 应用的状态管理库，为应用中的所有组件提供集中式的状态存储与操作，保证了所有状态以可预测的方式进行修改。

## 单一数据流

![](./imgs/vuex-flow.png)

## 流程图

![](./imgs/vuex.png)

## 核心概念

- View 即 Vue 组件。它们负责渲染界面，捕获用户事件，从 Store 获取数据。

- Store 用于管理数据。需要注意正常情况下 Vuex 应用为单一的 Store。但随着 Store 增大，可以利用 module 对 Store 进行划分。

- Action 是传递给 $store.dispatch() 方法的对象，与 Redux不同的是 ，Vuex 中的 Action 不是一个对象 ，可以认为是 Redux 中的 Action Type。

## 概念解析

Store：Vuex 中最核心概念莫过于 Store。其有四个主要API：

  - state : 定义了应用状态的数据结构，同样可以在这里设置默认的初始状态。

  - getters : 允许组件从 Store 中获取数据

  - mutations : 同步更新应用状态

  - actions : 异步更新应用状态 ，可通过 store.commit() 方法更新数据

  - modules : Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter甚至是嵌套子模块

```javascript
//注入store到vue实例
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

//store配置
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    homeVideoList:[],
    detailVideoInfo:{},
  },
  getters:{
    fetch_homeVideoList(state){
      return state.homeVideoList
    }
  },
  mutations:{
    update_Home_VideoList(state,data){
      state.homeVideoList = data.dailyList[0].videoList;
    }
  },
  actions:{
    fetchHomeFeed(store,payload){
      payload.$http.get("/api/v1/feed").then(response => {
        store.commit('update_Home_VideoList', response.data);
      })
    }
  }
})

export default store

```

## 参考链接

https://vuex.vuejs.org/zh-cn/intro.html

https://segmentfault.com/a/1190000007108052

https://github.com/vuejs/vuex/tree/dev/src