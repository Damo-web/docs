# Node Debug
  
> 众所周知，代码调试按照调试方式大致分为日志（Log）和断点（Breakpoint）两种： 日志是手动在代码中增加 Log 来获取到程序运行到该代码行时所需打印的对象；断点是在需要观察的点打上 Breakpoint 来获取到程序运行到该点时的所有上下文对象。下面篇目浅析下 Node.js 调试过程中的技巧。

## 日志

- **Console**

console 在开发 Web 应用时，是经常会运用到的打印日志函数，通用方法在此不再复述。

在打印大量日志时，需要对日志进一步区分，以达到快速定位所需信息的目的:

![](./img/debug_1.png)

如上图所示，可以在console.log()加辅助标志符或颜色来进行区分。

```javascript
// 代码段大致如下
// \x1b[35m代表字体颜色，\x1b[0m代表重置文字颜色

console.log("\x1b[35m分隔符 ------------------------------\x1b[0m")

// ANSI Escape Code配置如下
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"                  BgBlack = "\x1b[40m"
FgRed = "\x1b[31m"                    BgRed = "\x1b[41m"
FgGreen = "\x1b[32m"                  BgGreen = "\x1b[42m"
FgYellow = "\x1b[33m"                 BgYellow = "\x1b[43m"
FgBlue = "\x1b[34m"                   BgBlue = "\x1b[44m"
FgMagenta = "\x1b[35m"                BgMagenta = "\x1b[45m"
FgCyan = "\x1b[36m"                   BgCyan = "\x1b[46m"
FgWhite = "\x1b[37m"                  BgWhite = "\x1b[47m"
```

需要注意的是，Node 端打印 Object 时，会出现如下问题： 

```javascript
// 代码如下
const OBJECT_EXAMPLE = {
  "a":1,
  "b":{
     "c":2,
     "d":{
        "e":3,
        "f":{
           "g":4,
           "h":{
              "i":5
           }
        }
     }
  }
}

console.log(OBJECT_EXAMPLE);

// 命令行执行结果如下
{ a: 1, b: { c: 2, d: { e: 3, f: [Object] } } }

// 出现如下问题，主因在于 log 本质是字符串化的过程，详情可参阅：
// https://github.com/nodejs/node/blob/master/lib/internal/console/constructor.js?L213-L249#L213-L249

```
解决方法如下：

```javascript

// 利用 Node 内置 Util 模块
const util = require('util')
console.log(util.inspect(OBJECT_EXAMPLE, {showHidden: false, depth: null}))
console.log(util.inspect(OBJECT_EXAMPLE, false, null, true/* enable colors */))

// 利用 console 内置参数
console.log(JSON.stringify(OBJECT_EXAMPLE, null));
console.dir(OBJECT_EXAMPLE, { depth: null })

```


- **Node.js 日志库**

console 只适用于开发调试，并不适用生产环境。Node 生产环境下不但需要记录程序运行日志，还需要将重要日志记录到文件中，甚至写入至数据库中。随着 Node 运行日志的需求，衍生出专业的 npm 库，如： [winston](https://github.com/winstonjs/winston)、[log4js-node](https://github.com/log4js-node/log4js-node)、[bunyan](https://github.com/trentm/node-bunyan)等。

上述三个 log 库的性能对比及选择，可参阅：[a-benchmark-of-five-node-js-logging-libraries](https://www.loggly.com/blog/a-benchmark-of-five-node-js-logging-libraries/)

Node.js 日志库大致流程如下：

![](./img/debug_2.jpg)

下面以 winston 为例，浅谈下日志记录过程：

```javascript
// 安装 winston
npm install winston
yarn add winston 

const { createLogger, format, transports } = require('winston')

// 日志分级（ Level ）
// error, warn, info, verbose, debug, silly 
const logger = new winston.Logger({
  level: 'info',//分级配置
})

logger.log('info','hello level')

// 日志输出（ Transport ）
// 可通过 winston-mail 、 winston-mongodb等 npm 库来扩展输出口
const logger = new winston.Logger({
  level: 'info',//分级配置
  transports: [
     // 记录至命令行
     new winston.transports.Console(),
     // 记录至文件 combined.log
     new winston.transports.File({ filename: 'combined.log' })
   ]
})

logger.log('error','error transport')

// 日志格式化（ Format ）
const logger = createLogger({
  level: 'info',
  // format
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  // defaultMeta
  defaultMeta: { service: 'Demo-Service' },
  transports: [
    new winston.transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

logger.log('warn','warn format','')

```

## 断点

- **Chrome篇**

2016年，Node 决定将 Chrome 浏览器的开发者工具作为官方的调试工具。使用 Chrome DevTools 调试 Node 程序要遵循下述步骤：

1. 确保 Node.js 版本在v6.3.0+

2. 在 package.json 中进行如下配置：

```javascript

"scripts": {
   // --inspect 标记
   // 简单使用
   "debug": "node --inspect-brk main.js"
   // --inspect-brk 标记
   // 推荐使用
   // 此标记将在脚本的第一条语句处断开，以便你可以在源代码中设置断点，并根据需要启动/停止构建
   "debug": "node --inspect-brk main.js"
   // 因 Webpack 、Mocha等库具有自身的 CLI
   // 需要调用node_modules下对应库的 CLI 来进行调试
   "debug": "node --inspect-brk ./node_modules/webpack/bin/webpack.js --config build/webpack.config.js"
}

```

3. 启动系统命令行，执行如下操作

```bash
# 执行代码
yarn debug

# 执行结果
yarn run v1.10.1
$ node --inspect-brk ./node_modules/webpack/bin/webpack.js --config build/webpack.config.js
Debugger listening on ws://127.0.0.1:9229/00e0137c-b4f9-4d73-ac9f-f9831f09d81b
For help, see: https://nodejs.org/en/docs/inspector

```

4. 在浏览器中访问 chrome://inspect

![](./img/debug_3.png)

5. 单击 Device 标题下的 "Open dedicated DevTools for Node" 链接，打开一个专门 debugger 窗口，切换至 Connect 选项，并设置步骤三命令行结果中的端口（默认为9229），设置完成后关闭窗口

![](./img/debug_4.png)

6. 重新执行步骤三的命令，你会看到在 Remote Target 标题下可以进行 inspect(审查) 的活动脚本。单击 Remote Target 标题下的 "inspect" 链接，打开一个专门 debugger 窗口。

![](./img/debug_5.png)

- **VSCode篇**

作为一款流行实用的编辑器，VSCode 提供了内置的调试工具，可以便捷地对代码进行调试。使用 VSCode 调试 Node 程序的细节可参考： 

- [debugging](https://code.visualstudio.com/docs/editor/debugging)

- [Node.js debugging in VS Code
](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

在 launch.json 文件中添加配置时需要注意区分断点调试端及其启动方式：

![](./img/debug_6.png)

VSCode 按调试端可分为 Chrome 和 Node 两端：Chrome 会调用 Chrome Devtools 来进行调试；Node 会调用 CLI 来进行调试。

按启动方式可分为 Launch 和 Attach 两种模式： Launch 模式下，**VSCode 负责debug 整个生命周期**，包括启动、停止及调试；Attach模式下，**VSCode 只负责调试阶段**，用户必须自行启动及停止 debug。

:::tip 提示
**VSCode 1.22+ 版本已支持自动 Attach 相应 Node 调试端口，无需配置 launch.json 文件**
:::

Launch 模式下 Node 端调试的**示例文件配置**如下：

```javascript

// .vscode/launch.json

{
  "version": "0.2.0",
  "configurations": [
    {
      // 调试名称
      "name": "Launch via Yarn",
      "type": "node",
      // 启动方式
      "request": "launch",
      // 启动当前文件下的程序
      "cwd": "${workspaceRoot}",
      // 运行时启动命令，默认为 node
      "runtimeExecutable": "yarn",
      "windows": { "runtimeExecutable": "yarn.cmd" },
      // runtime 时传入参数，需与 package.json 中命令对应
      "runtimeArgs": ["run","debug"],
      // 日志输出到 Terminal，否则启动期的日志看不到
      "console": "integratedTerminal",
      // 调试协议
      "protocol": "auto",
      // 当源码更改时自动重启 debug
      "restart": true,
      // 默认为 9229 端口
      "port": 9229,
      // 自动 attach 至 Node 子进程 
      "autoAttachChildProcesses": true
    }
  ]
}

// package.json

"scripts": {
   "debug": "node --inspect-brk ./node_modules/webpack/bin/webpack.js --config build/webpack.config.js"
}

```
运行结果如下： 

![](./img/debug_7.png)

VSCode 除了上述基础调试功能，自1.22+ 版本已内置 Logpoints 功能，添加方式如下：

![](./img/debug_8.png)

如上图所示，菱形红点为 Logpoints，圆形红点为 Breakpoints，有关 Logpoints具体使用示例，可参阅：
[introducing-logpoints-and-auto-attach](https://code.visualstudio.com/blogs/2018/07/12/introducing-logpoints-and-auto-attach)

![](./img/debug_9.png)

按上图添加后，执行结果如下：

![](./img/debug_10.png)

:::tip 提示
**Chrome 73+ 版本已支持 Logpoints，可查阅：[What's New In DevTools (Chrome 73)](https://developers.google.com/web/updates/2019/01/devtools)**
:::

## 热重启

在日常的 Node 开发过程中，需要频繁修改应用程序，每次更改后，必须手动重启 Node 应用程序。

因这一场景，实现 Node 应用程序的热重启迫在眉睫，基于此，社区开发出实现 Node 热重启的 npm 库。常用的热重启库如下：

- [nodemon](https://nodemon.io/)

- [supervisor](https://github.com/petruisfan/node-supervisor/)

通过 Yarn 或 NPM 安装完成后，只需在运行应用时将命令行上的 node 替换成 nodemon 或 supervisor 即可。

:::tip 提示
相比 supervisor ，nodemon 更轻量级，内存占用更小，使用更加方便，更容易进行扩展，推荐使用。
:::


