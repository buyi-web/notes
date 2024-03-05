# Hook

[从实现到理解React Hook使用限制](https://juejin.cn/post/6844904122257244173)
[React Hooks 详解 【近 1W 字】+ 项目实战](https://juejin.cn/post/6844903985338400782#heading-8)

HOOK是React16.8.0之后出现

[hook api](https://reactjs.org/docs/hooks-reference.html)

组件：无状态组件（函数组件）、类组件

**类组件不足**

- 状态逻辑难以复用
  - 缺少复用机制
    - 不方便封装逻辑，使用渲染属性和高阶组件也有缺点
- 渲染属性和高阶组件导致层级冗余
  - 无论是高阶组件还是渲染属性，都相当与在原来的组件之上增加了新的组件层次。尤其是在 Chrome 调试器上会看到为了服用逻辑而添加的狠多组件层级，显得十分臃肿。不仅是调试体验问题、也存在着运行性能的问题
- 趋向复杂时难以维护
  - 生命周期函数函数混杂不相干逻辑
  - 相关逻辑代码经常会打散到不同生命周期中
- this 指向困扰
  - 内联函数需要绑定 this, 否则每次渲染都创建一个箭头函数
  - 类成员函数不能保证 this

HOOK专门用于增强函数组件的功能（HOOK在类组件中是不能使用的），使之理论上可以成为类组件的替代品

**hooks 优势**

- 函数组件无类实例 this 问题
  - hooks 是函数组件环境，所有逻辑都在函数内部，没有实例化概念，无复杂的 this 问题
自定义 
- Hook 函数方便复用状态逻辑
  - hooks 指的是在函数内部调用的特殊函数，我们可以自定义 hooks 函数，在 hooks 函数内部，依旧可以调用 useState 和 useEffect 等 hooks 函数。这样就可以非常高效的将可复用逻辑提取出来
- 副作用的关注点分离
  - hooks 天生优化了副作用代码逻辑
  - 每个 useEffect 来实现一个逻辑，不同逻辑写在不同的 useEffect 中，比冗在同一生命周期中好很多
- 以前副作用大都是写在生命函数周期中
  - 副作用：
  - 发送网络请求
  - 访问原始 DOM 元素
  - 访问本地存储
  - 绑定解绑事件

官方强调：没有必要更改已经完成的类组件，官方目前没有计划取消类组件，只是鼓励使用函数组件

HOOK（钩子）本质上是一个函数(命名上总是以use开头)，该函数可以挂载任何功能

## State Hook

State Hook是一个在函数组件中使用的函数（useState），用于在函数组件中使用状态

- 函数有一个参数，这个参数的值表示状态的默认值
- 函数的返回值是一个数组，该数组一定包含两项
  - 第一项：当前状态的值
  - 第二项：改变状态的函数

一个函数组件中可以有多个状态，这种做法非常有利于横向切分关注点。

Hook 内部使用 Object.is 来比较新/旧 state 是否相等

原理： 建议观看课程

***每次调用函数组件，通过调用 `useState` 的次数作为 索引的方式找到对应的状态链表（数组）进行创建或更改***

**注意的细节**

1. useState最好写到函数的起始位置，便于阅读
2. useState严禁出现在代码块（判断、循环）中
3. useState返回的函数（数组的第二项），引用不变（节约内存空间）
4. 使用函数改变数据，若数据和之前的数据完全相等（使用Object.is比较），不会导致重新渲染，以达到优化效率的目的。
5. 使用函数改变数据，传入的值不会和原来的数据进行合并，而是直接替换。
6. 如果要实现强制刷新组件
   1. 类组件：使用forceUpdate函数
   2. 函数组件：使用一个空对象的useState
7. **如果某些状态之间没有必然的联系，应该分化为不同的状态，而不要合并成一个对象**
8. 和类组件的状态一样，函数组件中改变状态可能是异步的（在DOM事件中），多个状态变化会合并以提高效率，此时，不能信任之前的状态，而应该使用回调函数的方式改变状态。如果状态变化要使用到之前的状态，尽量传递函数。

## Effect Hook

Effect Hook：用于在函数组件中处理副作用

副作用：

1. ajax请求
2. 计时器
3. 其他异步操作
4. 更改真实DOM对象
5. 本地存储
6. 其他会对外部产生影响的操作

函数：useEffect，该函数接收一个函数作为参数，接收的函数就是需要进行副作用操作的函数

**细节**:

1. 副作用函数的运行时间点，是在页面完成真实的UI渲染之后。因此它的执行是异步的，并且不会阻塞浏览器
   1. 与类组件中componentDidMount和componentDidUpdate的区别
   2. componentDidMount和componentDidUpdate，更改了真实DOM，但是用户还没有看到UI更新，同步的。
   3. useEffect中的副作用函数，更改了真实DOM，并且用户已经看到了UI更新，异步的。
2. 每个函数组件中，可以多次使用useEffect，但不要放入判断或循环等代码块中。
3. useEffect中的副作用函数，可以有返回值，返回值必须是一个函数，该函数叫做清理函数
   1. 该函数运行时间点，在每次运行副作用函数之前
   2. 首次渲染组件不会运行
   3. 组件被销毁时一定会运行
4. useEffect函数，可以传递第二个参数
   1. 第二个参数是一个数组
   2. 数组中记录该副作用的依赖数据
   3. 当组件重新渲染后，只有依赖数据与上一次不一样的时，才会执行副作用
   4. 所以，当传递了依赖数据之后，如果数据没有发生变化
      1. 副作用函数仅在第一次渲染后运行
      2. 清理函数仅在卸载组件后运行
5. 副作用函数中，如果使用了函数上下文中的变量，则由于闭包的影响，会导致副作用函数中变量不会实时变化。
6. 副作用函数在每次注册时，会覆盖掉之前的副作用函数，因此，尽量保持副作用函数稳定，否则控制起来会比较复杂。

## Reducer Hook

Flux：Facebook出品的一个数据流框架

1. 规定了数据是单向流动的
2. 数据存储在数据仓库中（目前，可以认为state就是一个存储数据的仓库）
3. action是改变数据的唯一原因（本质上就是一个对象，action有两个属性）
   1. type：字符串，动作的类型
   2. payload：任意类型，动作发生后的附加信息
   3. 例如，如果是添加一个学生，action可以描述为：
      1. ```{ type:"addStudent", payload: {学生对象的各种信息} }```
   4. 例如，如果要删除一个学生，action可以描述为：
      1. ```{ type:"deleteStudent", payload: 学生id }```
4. 具体改变数据的是一个函数，该函数叫做reducer
   1. 该函数接收两个参数
      1. state：表示当前数据仓库中的数据
      2. action：描述了如何去改变数据，以及改变数据的一些附加信息
   2. 该函数必须有一个返回结果，用于表示数据仓库变化之后的数据
      1. Flux要求，对象是不可变的，如果返回对象，必须创建新的对象
   3. reducer必须是纯函数，不能有任何副作用
5. 如果要触发reducer，不可以直接调用，而是应该调用一个辅助函数dispatch
   1. 该函数仅接收一个参数：action
   2. 该函数会间接去调用reducer，以达到改变数据的目的

**实现useReducer**：

```js
import { useState } from "react"
/**
 * 通用的useReducer函数
 * @param {function} reducer reducer函数，标准格式
 * @param {any} initialState 初始状态
 * @param {function} initFunc 用于计算初始值的函数
 */
export default function useReducer(reducer, initialState, initFunc) {
    const [state, setState] = useState(initFunc? initFunc(initialState): initialState)

    function dispatch(action) {
        const newState = reducer(state, action)
        console.log(`日志：n的值  ${state}->${newState}`)
        setState(newState);
    }

    return [state, dispatch];
}
```

## Context Hook

用于获取上下文数据

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。

**举例**：

```js
import React, { useContext } from 'react'

const ctx = React.createContext();

// function Test() {
//     return <ctx.Consumer>
//         {value => <h1>Test，上下文的值：{value}</h1>}
//     </ctx.Consumer>
// }

function Test() {
    const value = useContext(ctx);
    return <h1>Test，上下文的值：{value}</h1>
}

export default function App() {
    return (
        <div>
            <ctx.Provider value="abc">
                <Test />
            </ctx.Provider>
        </div>
    )
}

```

## useMemo 

useCallback 和 useMemo 的参数跟 useEffect 一致，他们之间最大的区别有是 useEffect 会用于处理副作用，这两个 hooks 不能。

使用 useMemo 方法可以避免无用方法的调用

```js
/**
 * 如果不加useMemo, 即时name不变，也会执行changeName函数，是不必要的
 * 如果changeName中使用了setState，那就相当于优化了
 */
const otherName = useMemo(() => {
  changeName(name);
}, [name]);
```

## useCallback 

如果 usememo 返回的是一个函数，那么可以使用 useCallback 替代

useCallback 解决的是传入子组件参数过度变化导致子组件过度渲染的问题

```js
// 这两个是等价的
useMemo(() => fn, []);
useCallback(fn, []);
```
每一次函数组件重新执行一次，这两个内部函数都会重复创建。然而实际上，他们都是一样的。 所以很多传递给子组件的函数直接使用 useCallback 包裹起来，会提升性能

## Ref Hooks

useRef函数：

1. 一个参数：默认值
2. 返回一个固定的对象，```{current: 值}```

使用 Ref 保存变量： 因为函数组件每一次都会重新执行，useRef创建的ref并不会随着组件的更新而重新构建，保存一些每一次都需要的使用的变量就需要 Ref Hook

定时器，Ref Hooks 的最佳实践

```js
function App() {
  const [count, setCount] = useState(1);
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count >= 10) {
      clearInterval(timer.current);
    }
  });

  return (
    <>
      <h1>count: {count}</h1>
    </>
  );
}
```

使用 Ref 保存上一个状态的值

```js
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef(-1);
  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <>
      <button
        onClick={() => {
          setCount(count => count + 1);
        }}
      >
        add{' '}
      </button>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
    </>
  );
}
```

## useLayoutEffect

useEffect 在全部渲染完毕后才会执行
useLayoutEffect 会在 浏览器 layout 之后，painting 之前执行
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
可以使用它来读取 DOM 布局并同步触发重渲染
在浏览器执行绘制之前 useLayoutEffect 内部的更新计划将被同步刷新
尽可能使用标准的 useEffect 以避免阻塞视图更新

## 自定义 Hook

- 自定义 Hook 更像是一种约定，而不是一种功能。如果函数的名字以 use 开头，并且调用了其他的 Hook，则就称其为一个自定义 Hook
- 有时候我们会想要在组件之间重用一些状态逻辑，之前要么用 render props ，要么用高阶组件，要么使用 redux
- 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的
- **Hook 是一种复用状态逻辑的方式，它不复用 state 本身**
- **事实上 Hook 的每次调用都有一个完全独立的 state**

```jsx
import React, { useLayoutEffect, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function useNumber(){
  let [number,setNumber] = useState(0);
  useEffect(()=>{
    setInterval(()=>{
        setNumber(number=>number+1);
    },1000);
  },[]);
  return [number,setNumber];
}
// 每个组件调用同一个 hook，只是复用 hook 的状态逻辑，并不会共用一个状态
function Counter1(){
    let [number,setNumber] = useNumber();
    return (
        <div><button onClick={()=>{
            setNumber(number+1)
        }}>{number}</button></div>
    )
}
function Counter2(){
    let [number,setNumber] = useNumber();
    return (
        <div><button  onClick={()=>{
            setNumber(number+1)
        }}>{number}</button></div>
    )
}
ReactDOM.render(<><Counter1 /><Counter2 /></>, document.getElementById('root'));

```
