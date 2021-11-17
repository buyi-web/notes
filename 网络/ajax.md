# Ajax

## [Ajax | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX)

AJAX 是异步的 JavaScript 和 XML（Asynchronous JavaScript And XML）。简单点说，就是使用 XMLHttpRequest 对象与服务器通信。 它可以使用 JSON，XML，HTML 和 text 文本等格式发送和接收数据。AJAX 最吸引人的就是它的“异步”特性，也就是说他可以在不重新刷新页面的情况下与服务器通信，交换数据，或更新页面。

## 创建一个ajax

- 创建 XMLHttpRequest 对象

```js
if (window.XMLHttpRequest) {
  // Mozilla, Safari, IE7+ ...
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE 6 and older
  httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}
```

- 绑定 onreadystatechange 事件

```js 
httpRequest.onreadystatechange = function () {
  // Process the server response here.
};
```

- 向服务器发送请求

```js
httpRequest.open("GET", "http://www.example.org/some.file", true);
httpRequest.send();
```

完整例子：

```js
function ajax(url, cb) {
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb(xhr.responseText);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}
```

## httpRequest.readyState 的值

- 0 (未初始化) or (请求还未初始化)
- 1 (正在加载) or (已建立服务器链接)
- 2 (加载成功) or (请求已接受)
- 3 (交互) or (正在处理请求)
- 4 (完成) or (请求已完成并且响应已准备好)

## 访问服务端返回的数据

- httpRequest.responseText
  - 服务器以文本字符的形式返回
- httpRequest.responseXML
  - 以 XMLDocument 对象方式返回，之后就可以使用 JavaScript 来处理

## GET 注意事项

- 如果不设置响应头 Cache-Control: no-cache 浏览器将会把响应缓存下来而且再也不无法重新提交请求。你也可以添加一个总是不同的 GET 参数，比如时间戳或者随机数 (详情见 [bypassing the cache](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#bypassing_the_cache))

## POST 请求

POST 请求则需要设置RequestHeader告诉后台传递内容的编码方式以及在 send 方法里传入对应的值

```js
xhr.open("POST", url, true);
xhr.setRequestHeader(("Content-Type": "application/x-www-form-urlencoded"));
xhr.send("key1=value1&key2=value2");
```

## Ajax 与 cookie

- ajax 会自动带上同源的 cookie，不会带上不同源的 cookie
可以通过前端设置 `withCredentials` 为 true， 后端设置 Header 的方式让 ajax 自动带上不同源的 cookie，但是这个属性对同源请求没有任何影响。会被自动忽略。

[withCredentials | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)

```js
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://example.com/", true);
xhr.withCredentials = true;
xhr.send(null);
```

## 优点： 

- 提高了性能和速度：减少了客户端和服务器之间的流量传输，同时减少了双方响应的时间，响应更快，因此提高了性能和速度

- 交互性好：使用ajax，可以开发更快，更具交互性的Web应用程序

- 异步调用：Ajax对Web服务器进行异步调用。这意味着客户端浏览器在开始渲染之前避免等待所有数据到达。

- 节省带宽：基于Ajax的应用程序使用较少的服务器带宽，因为无需重新加载完整的页面
底层使用XMLHttpRequest

## 缺点： 

- 针对 mvc 编程，由于近来vue和React的兴起，不符合mvvm前端开发流程。

- 单纯使用 ajax 封装，核心是使用 XMLHttpRequest 对象,使用较多并有先后顺序的话，容易产生回调地狱。

- Ajax应用程序中的安全性较低（容易收到CSRF和XSS攻击)，因为所有文件都是在客户端下载的
可能出现网络延迟的问题
