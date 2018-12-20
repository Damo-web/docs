# Flux 架构

> Flux是Facebook用来构建客户端Web应用的应用架构。它利用单向数据流的方式来组合React中的视图组件。

## 单向数据流

- 极简流程图：

![](./imgs/flux-1.png)

- 考虑到项目中，用户交互也会产生一个新Action，流程图应如下：

![](./imgs/flux-2.png)

- 考虑到项目中，Action Creators可能会向外部请求数据，完整流程图应如下：

![](./imgs/flux-3.png)

## 核心概念

- Views 即 React 组件。它们负责渲染界面，捕获用户事件，从 Stores 获取数据。

- Stores 用于管理数据。 一个 Store 管理一个区域的数据，当数据变化时它负责通知 Views。

- Dispatcher 用于接收新数据然后传递给 Stores，Stores 更新数据并通知 Views。

- Actions 是传递给 Dispatcher 的对象，包含新数据和 Action Type。

- Action Types 指定了可以创建哪些 Actions，Stores 只会更新特定 Action Type 的 Actions 触发的数据。

- Action Creators 是 Actions 的创建者，并将Actions传递给 Dispatcher 或 Web Utils。

- Web Utils 是用于与外部 API 通信的对象。例如 Actions Creator 可能需要从服务器请求数据。

## 概念解析

- Action：包含Action Type以及应用送往store(存储)的信息载荷(payload,也可称为有效信息)

  Action具有固定格式，即FSA, 全称为Flux Standard Action，格式如下:

  ```javascript

  {
    type: 'ADD_TODO',
    payload: {
      text: 'Do something'  
    }
  }

  ```
- Action Type : Action中的type , 如下：

  ```javascript

  {
    type: 'COMPLETE_TODO', //action type
    payload: {
      text: 'Do something'  
    }
  }

  ```

- Action Creator ：是一种辅助创建Action的函数，类似工厂模式，传入参数生成对应的Action ，并将Action 传递给 Dispatcher ，如下所示：

  ```javascript

  actionCreateor(text) {
    Dispatcher.dispatch({
      actionType: 'ADD_ITEM',
      text: text
    });
  }

  ```

- Web Utils : 用于网络请求，获取服务器端数据(axios、fetch及ajax等方式发起http请求)

  ```javascript

  //Action Creator
  function loadSomeData(userId) {
    return dispatch => fetch(`http://data.com/${userId}`)
      .then(res => res.json())
      .then(
        data => dispatch({ type: 'LOAD_SOME_DATA_SUCCESS', data }),
        err => dispatch({ type: 'LOAD_SOME_DATA_FAILURE', err })
      );
  }

  ```

- Dispatcher : 将Action和Store联系在一起，Action中通过Dispatcher.dispatch({actionType, payload})来分发事件，Store中通过Dispatcher.register(function(action))来响应其注册的Action。注意，Dispatcher 只能有一个，而且是全局的。

  ```javascript

  //引用模块
  var Dispatcher = require('flux').Dispatcher;

  // 分发事件，即创建Action
  var Actions = {
    Createor: function (text) {
      Dispatcher.dispatch({
        actionType: 'ADD_ITEM',
        text: text
      });
    }
  };

  // Store响应Action
  Dispatcher.register(function (action) {
    switch(action.actionType) {
      case 'ADD_ITEM':
        Store.handlerAddItem(action.text); //回调函数，用于存储数据到Store
        Store.emitChange();//回调函数，通知数据改变
        break;
    }
  })

  ```

- Stores : 保存数据及当数据变动时通知视图更新(pub/sub模式)

  ```javascript
  //引用node的EventEmitter模块
  var EventEmitter = require('events').EventEmitter;

  //Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象
  var Store = Object.assign({},EventEmitter.prototype, {

    items: [],

    getAll: function () {
      return this.items;
    },

    //添加数据
    handlerAddItem: function (text) {
      this.items.push(text);
    },

    //通知数据变化
    emitChange: function () {
      this.emit('change');
    },

    addChangeListener: function(callback) {
      this.addEventListener('change', callback);
    },

    removeChangeListener: function(callback) {
      this.removeEventListener('change', callback);
    }
  });

  ```

- Views : 视图层及数据变动时重新渲染视图

  ```javascript

  import React,{Component} from 'react';

  export default class Class extends Component {

    constructor(props) {
      super(props);
      this.state = {items: Store.getAll()};
    }

    //componentDidMount生命周期内添加监听事件
    componentDidMount: function() {
      Store.addChangeListener(this.storeChange);
    }

    //componentWillUnmount生命周期内移除监听事件
    componentWillUnmount: function() {
      Store.removeChangeListener(this.storeChange);
    }

    //当数据发生改变时，调用setState进行组件重新渲染
    storeChange: function () {
      this.setState({
        items: Store.getAll()
      });
    }

    addItem: function () {
      Actions.addItem('new item');
    }

    render() {
      return (
        <View
          items={this.state.items}
          onClick={this.addItem}
        />;
        );
    }
  }

  ```

## 归纳总结

Flux数据流：

  1. 用户交互操作，触发Action Creator ，生成一个 action

  2. Action Creator 将生成的 action 发送给 Dispatcher(调度者)

  3. Dispatcher 将 action 传递给 Store ，并对当前 action 做出响应，更新 state

  4. 一旦 Store 更新 state 完毕，就会告知订阅了该 store 的 View 组件

  5. View 组件获取更新后的 state ，进行重新渲染

简短点：当用户进行操作的时候，会从组件发出一个 action，这个 action 流到 store 里面，触发 store 对state进行改动，然后 store 又触发组件基于新state的重新渲染。

## 利弊

Flux核心：

- 视图层组件不允许直接修改state，只能触发 action

- state统一放置到store中，可通过监听 action 来操作state

- 单向数据流：View单向依赖Store，而View对Store的修改，只能通过action分发（dispatch）的方式流回Store进行操作

优点：

- 组件复用性高：

  组件逻辑清晰，只包含了渲染逻辑和触发 action 这两个职责

- 状态可控：

  要理解一个 store 可能发生的state变化，只需要看它所注册的 actions 回调就可以。

- 方便时间旅行及调试：

  任何状态的变化都必须通过 action 触发，而 action 又必须通过 dispatcher 走，所以整个应用的每一次状态变化都会从同一个地方流过。Flux 的意义就在于强制让所有的状态变化都必须留下一笔记录，这样就可以利用这个来做各种 debug 工具、历史回滚等等。

缺点：

- Flux仅提供管理数据流的思路

- 没解决非共同父类的兄弟节点之间的通信问题

- Flux里面会有存在多个 store 存储数据，每个store里都有其对应的更新逻辑，随着项目增大会造成维护困难和逻辑紊乱

- Flux内大量的actions和stores，仅通过单一Dispatcher来进行分发，action与store之间的映射管理起来不方便

- 没实现action和其对应store内的更新逻辑的耦合，管理起来不方便


## 参考链接

- Flux：

  https://zhuanlan.zhihu.com/p/20263396

  http://www.ruanyifeng.com/blog/2016/01/flux.html

  https://blog.andrewray.me/flux-for-stupid-people/

  https://www.zhihu.com/question/33864532

  https://segmentfault.com/a/1190000002777101

- API of the Object.assign()

  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
