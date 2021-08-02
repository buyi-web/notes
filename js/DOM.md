# DOM

## event对象常用属性

- event.target 
   - 触发事件的元素
- event.currentTarget 
   - 绑定事件的元素
- event.preventDefault() 
   - 阻止默认行为
   - event.cancelBubble()和 event.preventBubble 都已经废弃
- event.stopPropagation()
    - 阻止在捕获阶段或冒泡阶段继续传播，而不是阻止冒泡
- event.stopImmediatePropagation()
    - 阻止事件冒泡并且阻止相同事件的其他侦听器被调用。

## 事件的代理/委托

事件委托是指将事件绑定目标元素的到父元素上，利用冒泡机制触发该事件

优点：

- 可以减少事件注册，节省大量内存占用
- 可以将事件应用于动态添加的子元素上

但使用不当会造成事件在不应该触发时触发

```js
ulDom.addEventListener(
  "click",
  function (event) {
    var target = event.target || event.srcElement;
    if (target && target.nodeName.toUpperCase() === "LI") {
        ...
    }
  },
  false
);
```

## 自定义事件

- [Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)
- [CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

`CustomEvent` 不仅可以用来做自定义事件，还可以在后面跟一个 object 做参数

```js
var evt = new Event("myEvent");
elDom.addEventListener("myEvent", function () {
  //处理这个自定义事件
});

elDom.dispatchEvent(evt);
```

## IE 与火狐的事件机制有什么区别？ 如何阻止冒泡？

IE 只事件冒泡，不支持事件捕获；火狐同时支持件冒泡和事件捕获。

阻止冒泡：

- 取消默认操作
    - w3c 的方法是 e.preventDefault()
    - IE 则是使用 e.returnValue = false;
- return false
    - javascript 的 return false 只会阻止默认行为
    - 是用 jQuery 的话则既阻止默认行为又防止对象冒泡。
- 阻止冒泡
    - w3c 的方法是 e.stopPropagation()
    - IE 则是使用 e.cancelBubble = true

## DOM 元素的 dom.getAttribute(propName)和 dom.propName 有什么区别和联系?

- dom.getAttribute()，是标准 DOM 操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中设置的属性
- dom.propName 通常是在 HTML 文档中访问特定元素的特性，浏览器解析元素后生成对应对象（如 a 标签生成 HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用 `getAttribute` 进行访问
- dom.getAttribute()返回值是源文件中设置的值，类型是字符串或者 null（有的实现返回""）
- dom.propName 返回值可能是字符串、布尔值、对象、undefined 等
- 大部分 attribute 与 property 是一一对应关系，修改其中一个会影响另一个，如 id，title 等属性
- 一些 attribute 和 property 不是一一对应如：form 控件中`<input value="hello"/>`对应的是 defaultValue，修改或设置 value property 修改的是控件当前值，setAttribute 修改 value 属性不会改变 value property
- 一些布尔属性`<input hidden/>`的检测设置需要 `hasAttribute` 和 `removeAttribute` 来完成，或者设置对应 property
- 像`<a href="../index.html">link</a>`中 `href` 属性，转换成 property 的时候需要通过转换得到完整 URL

## Window 对象 与 document 对象

window

- Window 对象表示当前浏览器的窗口，是 JavaScript 的顶级对象。
- 我们创建的所有对象、函数、变量都是 Window 对象的成员。
- Window 对象的方法和属性是在全局范围内有效的。

document

- Document 对象是 HTML 文档的根节点与所有其他节点（元素节点，文本节点，属性节点, 注释节点）
- Document 对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
- Document 对象是 Window 对象的一部分，即 window.document

## 区分什么是“客户区坐标”、“页面坐标”、“屏幕坐标”

客户区坐标
- 鼠标指针在可视区中的水平坐标(clientX)和垂直坐标(clientY)

页面坐标
- 鼠标指针在页面布局中的水平坐标(pageX)和垂直坐标

屏幕坐标
- 设备物理屏幕的水平坐标(screenX)和垂直坐标(screenY)

## mouseover/mouseout 与 mouseenter/mouseleave 的区别与联系

1. mouseover/mouseout 是标准事件，所有浏览器都支持；mouseenter/mouseleave 是 IE5.5 引入的特有事件后来被 DOM3 标准采纳，现代标准浏览器也支持
2. mouseover/mouseout 是冒泡事件；mouseenter/mouseleave不冒泡。需要为多个元素监听鼠标移入/出事件时，推荐 mouseover/mouseout 托管，提高性能
3. 标准事件模型中 event.target 表示发生移入/出的元素,event.relatedTarget对应移入/出元素；在老 IE 中 event.srcElement 表示发生移入/出的元素，event.toElement表示移出的目标元素，event.fromElement表示移入时的来源元素