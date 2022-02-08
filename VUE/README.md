# VUE2

## 什么时什么是 mvvm？

MVVM 是 Model-View-ViewModel 的缩写。mvvm 是一种设计思想。Model 层代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑；View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来，ViewModel 是一个同步 View 和 Model 的对象。

在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

## mvvm 和 mvc 区别？

mvc 和 mvvm 其实区别并不大。都是一种设计思想。主要就是 mvc 中 Controller 演变成 mvvm 中的 viewModel。mvvm 主要解决了 mvc 中大量的 DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。和当 Model 频繁发生变化，开发者需要主动更新到 View 

## vue 的优点是什么？

- 低耦合。视图（View）可以独立于 Model 变化和修改，一个 ViewModel 可以绑定到不同的"View"上，当 View 变化的时候 Model 可以不变，当 Model 变化的时候 View 也可以不变。
- 可重用性。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 view 重用这段视图逻辑。
- 独立开发。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计，使用 Expression Blend 可以很容易设计界面并生成 xml 代码。
- 可测试。界面素来是比较难于测试的，而现在测试可以针对 ViewModel 来写。

## 请详细说下你对 vue 生命周期的理解？

答：总共分为 8 个阶段创建前/后，载入前/后，更新前/后，销毁前/后。

- 创建前/后： 在 beforeCreate 阶段，vue 实例的挂载元素 el 还没有。
- 载入前/后：在 beforeMount 阶段，vue 实例的$el 和 data 都初始化了，但还是挂载之前为虚拟的 dom 节点，data.message 还未替换。在 mounted 阶段，vue 实例挂载完成，data.message 成功渲染。
- 更新前/后：当 data 变化时，会触发 beforeUpdate 和 updated 方法。
- 销毁前/后：在执行 destroy 方法后，对 data 的改变不会再触发周期函数，说明此时 vue 实例已经解除了事件监听以及和 dom 的绑定，但是 dom 结构依然存在

## vue的响应式

vue.js是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter和getter，在数据变动时发布消息给订阅者，触发相应的监听回调

`Observer（数据监听器）` : Observer的核心是通过Object.defineProprtty()来监听数据的变动，这个函数内部可以定义setter和getter，每当数据发生变化，就会触发setter。这时候Observer就要通知订阅者，订阅者就是Watcher

`Watcher（订阅者） `: Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：

在自身实例化时往属性订阅器(dep)里面添加自己
自身必须有一个update()方法
待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调

`Compile（指令解析器） `: Compile主要做的事情是解析模板指令，将模板中变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加鉴定数据的订阅者，一旦数据有变动，收到通知，更新试图

### 为什么data会直接出现在vm实例对象中咧？

当创建vue实例的时候，vue会将data中的成员代理给vue实例，目的是为了实现响应式，监控数据的变化，如何做到的呢？vue2中是使用Object.defineProperty，vue3.0中用proxy

假如说我们自己写的data名称和vue中自带的属性冲突了，那么就会覆盖vue内部的属性，所以为了防止名称冲突，vue会把自己内部的属性成员名称前加上$或_，如果加上的是$，代表是我们可以使用的，如果加上的是_，是vue自己内部使用的方法或属性，我们不需要调用

### 组件中的data为什么是一个函数？

1.一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。 2.如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数。


## v-if 和 v-show 的区别

1. v-if能够控制是否生成vnode,也就简介控制了是否生成对应的dom。当v-if为true时，会生成对应的vnode，并生成对应的dom;为false时不会生成vnode和dom

2. v-show始终都会生成vnode,也就间接始终生成dom，他只是控制dom的display的属性，为true时不做任何处理，为false时display为none

3. v-if 有更高的切换开销，v-show 有更高的初始渲染开销，如果需要非常频繁地切换，则使用 v-show 较好，如果在运行时条件很少改变，则使用 v-if 较好

4. v-show不支持`<template>`元素

5. v-show不支持v-else/v-else-if

## computed与watch

通俗来讲，既能用 computed 实现又可以用 watch 监听来实现的功能，推荐用 computed， 重点在于 computed 的缓存功能 computed 计算属性是用来声明式的描述一个值依赖了其它的值，当所依赖的值或者变量 改变时，计算属性也会跟着改变； watch 监听的是已经在 data 中定义的变量，当该变量变化时，会触发 watch 中的方法。


## 组件_通信

**prop**
父组件传递数据给子组件时，可以通过特性传递。
推荐使用这种方式进行父->子通信。

**$emit**
子组件传递数据给父组件时，触发事件，从而抛出数据。
推荐使用这种方式进行子->父通信。
