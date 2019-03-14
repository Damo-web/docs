# Node Debug
  
> 众所周知，代码调试按照调试方式大致分为日志（Log）和断点（Breakpoint）两种： 日志是手动在代码中增加 Log 来获取到程序运行到该代码行时所需打印的对象；断点是在需要观察的点打上 Breakpoint 来获取到程序运行到该点时的所有上下文对象。下面篇目浅析下 Node.js 调试过程中的技巧。

## 日志

- console

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


- winston

console 只适用于开发调试，并不适用生产环境。Node 生产环境下不但需要记录程序运行日志，还需要将重要日志记录到文件中，甚至写入至数据库中。随着 Node 运行日志的需求，衍生出专业的 npm 库，如： [winston](https://github.com/winstonjs/winston)、[log4js-node](https://github.com/log4js-node/log4js-node)、[bunyan](https://github.com/trentm/node-bunyan)等。

上述三个 log 库的性能对比及选择，可参阅：[a-benchmark-of-five-node-js-logging-libraries](https://www.loggly.com/blog/a-benchmark-of-five-node-js-logging-libraries/)

下面以 winston 为例，浅谈下日志记录过程：

```javascript
// 安装 winston
npm install winston
yarn add winston 

// 日志分级（ Level ）
const logger = new winston.Logger({
  level: 'info',//分级配置
})

logger.log('info','hello level')

// 输出口（ Transport ）
// 可通过 winston-mail 、 winston-mongodb等 npm 库来扩展输出口

const logger = new winston.Logger({
  level: 'info',//分级配置
  transports: [
     new winston.transports.Console(),
     new winston.transports.File({ filename: 'combined.log' })
   ]
})

logger.log('error','error transport')

// 格式化（ Format ）



```

## 断点

- Chrome篇


- VsCode篇


- CommandLine篇


## 热更新

- nodemon

- supvisor


