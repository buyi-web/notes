# js 基础

## [变量](https://github.com/buyi-web/notes/blob/master/js/%E5%8F%98%E9%87%8F%E7%B1%BB%E5%9E%8B.md)

## [BOM](https://github.com/buyi-web/notes/blob/master/js/BOM.md)

## 其他常见问题

### eval 是做什么的？

eval 的功能是把对应的字符串解析成 JS 代码并运行

- eval 不安全，若有用户输入会有被攻击风险
- 非常耗性能（先解析成 js 语句，再执行）

### [严格模式的限制](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode)

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用 with 语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量 delete prop，会报错，只能删除属性 delete global\[prop]
- eval 不会在它的外层作用域引入变量
- eval 和 arguments 不能被重新赋值
- arguments 不会自动反映函数参数的变化
- 不能使用 arguments.callee
- 不能使用 arguments.caller
- 禁止 this 指向全局对象
- 不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
- 增加了保留字（比如 protected、static 和 interface）

### Javascript 垃圾回收方法

标记清除（mark and sweep）

- 这是 JavaScript 最常见的垃圾回收方式，当变量进入执行环境的时候，比如函数中声明一个变量，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”
- 垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的变量了

引用计数(reference counting)

- 在低版本 IE 中经常会出现内存泄露，很多时候就是因为其采用引用计数方式进行垃圾回收。引用计数的策略是跟踪记录每个值被使用的次数，当声明了一个 变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加 1，如果该变量的值变成了另外一个，则这个值得引用次数减 1，当这个值的引用次数变为 0 的时 候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的空间

参考链接 [内存管理-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)

### 哪些操作会造成内存泄漏？

JavaScript 内存泄露指对象在不需要使用它时仍然存在，导致占用的内存不能使用或回收

- 未使用 var 声明的全局变量
- 闭包函数(Closures)
- 循环引用(两个对象相互引用)
- 控制台日志(console.log)
- 移除存在绑定事件的 DOM 元素(IE)

### 为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？

模块化可以给我们带来以下好处

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

实现模块化方式：

- 立即执行函数
- AMD 和 CMD
- CommonJS
- ES Module

### setTimeout、setInterval

常见的定时器函数有 `setTimeout`、`setInterval`、`requestAnimationFrame`，但 setTimeout、setInterval 并不是到了哪个时间就执行，而是到了那个时间把任务加入到异步事件队列中。

因为 JS 是单线程执行的，如果某些同步代码影响了性能，就会导致 setTimeout 不会按期执行。

而 setInterval 可能经过了很多同步代码的阻塞，导致不正确了，可以使用 setTimeout 每次获取 Date 值，计算距离下一次期望执行的时间还有多久来动态的调整。

[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题

### cookie，localStorage，sessionStorage，indexDB

|特性|cookie|localStorage|sessionStorage|indexDB|
|:-:|:-:|:-:|:-:|:-:|
|数据生命周期|一般由服务器生成，可以设置过期时间|除非被清理，否则一直存在|页面关闭就清理|除非被清理，否则一直存在|
|数据存储大小|4K|5M|5M|无限|
|与服务端通信|每次都会携带在 header 中，对于请求性能影响|不参与|不参与|不参与|

从上表可以看到，`cookie` 已经不建议用于存储。如果没有大量数据存储需求的话，可以使用 `localStorage` 和 `sessionStorage` 。对于不怎么改变的数据尽量使用 `localStorage` 存储，否则可以用 `sessionStorage` 存储。

对于 cookie，我们还需要注意安全性。

|属性|作用|
|:-:|:-:|
|value|如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识|
|http-only|不能通过 JS 访问 Cookie，减少 XSS 攻击|
|secure|只能在协议为 HTTPS 的请求中携带|
|same-site|规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击|

### 不同循环遍历方法的应用场景，哪种遍历方法最快

**哪种循环遍历方法最快？**

测试的方法是，遍历一个有 100 万个元素的数组，计算出整个过程的耗时，代码如下：
```js
const million = 1000000; 
const arr = Array(million);
console.time('⏳');

for (let i = arr.length; i > 0; i--) {} // for(reverse) :- 1.5ms
for (let i = 0; i < arr.length; i++) {} // for          :- 1.6ms

arr.forEach(v => v)                     // foreach      :- 2.1ms
for (const v of arr) {}                 // for...of     :- 11.7ms

console.timeEnd('⏳');
```
结论：for(reverse)遍历最快

>译者注：这里 for 的正向遍历和反向遍历耗时几乎是一样的，只有 0.1ms 的差异。原因是 for(reverse) 只进行一次 let i = arr.length , 而在 for 中每次都要进行 i < arr.length 判断，针对这点细微的差别可以忽略。和 for 相比，foreach 和 for...of 在数组遍历过程会更耗时。

**不同循环遍历方法的应用场景**

for 循环：
- `for` 是大家较为熟悉的循环遍历方式，而且它的遍历速度是最快的，那是不是什么场景都推荐用 for 呢？答案是否定的，因为除了要考虑性能因素之外，代码的可读性通常更为重要。

forEach：
- `forEach` 在数组遍历过程中，不能被 `break` 或 `return` 提前结束循环。

for ... of:
- for...of 是 ES6 支持的特性，用于遍历可迭代的对象，例如 String、Array、Map 和 Set 等，它对于代码可读性比较好


>译者注：Airbnb 的代码规范中是不推荐使用 for...of 语句的。如果在 eslint 配置了 eslint-config-airbnb，当代码中使用了 for...of 会提示 iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations. 虽然 Airbnb 的代码规范维护者，同样认为代码的可读性要比性能更重要，但是 for...of 的迭代遍历的底层是依赖于 Symbol，需要引入 regenerator-runtime 来做支持。为了用 for...of 而引入一个额外的库，付出的成本有点高

for...in
- for...in 可以遍历访问对象的所有可枚举属性。当用 for...in 访问数组的时候，除了返回数组的索引之外，数组上的用户自定义属性也会被返回，所以要避免用 for...in 遍历数组。

>译者注：Airbnb 的代码规范中也不推荐使用 for...in 来遍历对象的属性，推荐的方法是使用 Object.{keys,values,entries}

**总结**

- for 速度最快, 但可读性差
- foreach 速度快, 可控制属性
- for...of 比较慢, 但好用
- for...in 比较慢, 最不好用

>建议，把代码的可读性放在第一位。当开发一个复杂的结构（系统）时，代码可读性是必不可少的，但是也应该关注性能。尽量避免在代码中添加不必要的东西，以减少对应用程序性能造成的影响。

