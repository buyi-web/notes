# 解析 bind 原理，并手写 bind 实现

https://github.com/sisterAn/JavaScript-Algorithms/issues/81

> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。 ——mdn

bind 方法与 call / apply 最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。

## 模拟实现

```js
Function.prototype.bind =  function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    // this 指向调用者
    var self = this;
     // 因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1);
    // 返回一个函数
    return function () {
        // 这时的arguments是指bind返回的函数传入的参数
        // 即 return function 的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs) );
    }
}
```

但还有一个问题，bind 有以下一个特性：

> 一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器，提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

来个例子说明下：

```js
let value = 2;
let foo = {
    value: 1
};
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

let bindFoo = bar.bind(foo, 'Jack');
let obj = new bindFoo(20);
// undefined
// Jack
// 20

obj.habit;
// shopping

obj.friend;
// kevin
```

上面例子中，运行结果 this.value 输出为 undefined ，这不是全局 value 也不是 foo 对象中的 value ，这说明 bind 的 this 对象失效了，new 的实现中生成一个新的对象，这个时候的 this 指向的是 obj 。

这个可以通过修改返回函数的原型来实现，代码如下:

```js
Function.prototype.bind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    
    // this 指向调用者
    var self = this;
    // 因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1);
    
    // 创建一个空对象
    var fNOP = function () {};
    
    // 返回一个函数
    var fBound = function () {
        // 获取 bind 返回函数的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 然后同传入参数合并成一个参数数组，并作为 self.apply() 的第二个参数
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
        // 注释1
    }
     // 注释2
    // 空对象的原型指向绑定函数的原型
    fNOP.prototype = this.prototype;
    // 空对象的实例赋值给 fBound.prototype
    fBound.prototype = new fNOP();
    return fBound;
}
```

**注释1**

- 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true ，可以让实例获得来自绑定函数的值，即上例中实例会具有 habit 属性。
- 当作为普通函数时，this 指向 window ，此时结果为 false ，将绑定函数的 this 指向 context

**注释2**

- 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值，即上例中 obj 可以获取到 bar 原型上的 friend
- 至于为什么使用一个空对象 fNOP 作为中介，把 fBound.prototype 赋值为空对象的实例（原型式继承），这是因为直接 fBound.prototype = this.prototype 有一个缺点，修改 fBound.prototype 的时候，也会直接修改 this.prototype ；其实也可以直接使用ES5的 Object.create() 方法生成一个新对象，但 bind 和 Object.create() 都是ES5方法，部分IE浏览器（IE < 9）并不支