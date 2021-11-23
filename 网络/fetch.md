# fetch

[toc]

获取响应通常需要经过两个阶段。

**第一阶段，当服务器发送了响应头`（response header）`，fetch 返回的 `promise` 就使用内建的 Response class 对象来对响应头进行解析。**

在这个阶段，我们可以通过检查响应头，来检查 HTTP 状态以确定请求是否成功，当前还没有响应体（response body）。

如果 fetch 无法建立一个 HTTP 请求，例如网络问题，亦或是请求的网址不存在，那么 promise 就会 reject。异常的 HTTP 状态，例如 404 或 500，不会导致出现 error。

我们可以在 response 的属性中看到 HTTP 状态：

- `status` —— HTTP 状态码，例如 200。
- `ok` —— 布尔值，如果 HTTP 状态码为 200-299，则为 true。

```JS
let response = await fetch(url);

if (response.ok) { // 如果 HTTP 状态码为 200-299
  // 获取 response body（此方法会在下面解释）
  let json = await response.json();
} else {
  alert("HTTP-Error: " + response.status);
}
```

**第二阶段，为了获取 response body，我们需要使用一个其他的方法调用。**

Response 提供了多种基于 promise 的方法，来以不同的格式访问 body：

- response.text() —— 读取 response，并以文本形式返回 response，
- response.json() —— 将 response 解析为 JSON，
- response.formData() —— 以 FormData 对象）的形式返回 response，
- response.blob() —— 以 Blob（具有类型的二进制数据）形式返回 response，
- response.arrayBuffer() —— 以 ArrayBuffer（低级别的二进制数据）形式返回 response，
- 另外，response.body 是 ReadableStream 对象，它允许你逐块读取 body，我们稍后会用一个例子解释它。

**我们只能选择一种读取 body 的方法。**

如果我们已经使用了 response.text() 方法来获取 response，那么如果再用 response.json()，则不会生效，因为 body 内容已经被处理过了。

## Response header

Response header 位于 response.headers 中的一个类似于 Map 的 header 对象。

它不是真正的 Map，但是它具有类似的方法，我们可以按名称（name）获取各个 header，或迭代它们：

```js
let response = await fetch(url);

// 获取一个 header
alert(response.headers.get('Content-Type')); // application/json; charset=utf-8

// 迭代所有 header
for (let [key, value] of response.headers) {
  alert(`${key} = ${value}`);
}
```

## Request header

要在 fetch 中设置 request header，我们可以使用 headers 选项。它有一个带有输出 header 的对象，如下所示：

```js
let response = fetch(protectedUrl, {
  headers: {
    Authentication: 'secret'
  }
});
```

……但是有一些我们无法设置的 header(详见 [forbidden HTTP header](https://fetch.spec.whatwg.org/#forbidden-header-name))

这些 header 保证了 HTTP 的正确性和安全性，所以它们仅由浏览器控制。

## FormData

`FormData` 的特殊之处在于网络方法（network methods），例如 fetch 可以接受一个 FormData 对象作为 body。它会被编码并发送出去，带有 `Content-Type: multipart/form-data`。

```html
<form id="formElem">
  <input type="text" name="name" value="John">
  <input type="text" name="surname" value="Smith">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user', {
      method: 'POST',
      body: new FormData(formElem)
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

我们可以使用以下方法修改 FormData 中的字段：

- `formData.append(name, value)` —— 添加具有给定 name 和 value 的表单字段，
- `formData.append(name, blob, fileName)` —— 添加一个字段，就像它是 `<input type="file">`，第三个参数 fileName 设置文件名（而不是表单字段名），因为它是用户文件系统 中文件的名称，
- `formData.delete(name)` —— 移除带有给定 name 的字段，
- `formData.get(name)` —— 获取带有给定 name 的字段值，
- `formData.has(name)` —— 如果存在带有给定 name 的字段，则返回 true，否则返回 false。

从技术上来讲，一个表单可以包含多个具有相同 name 的字段，因此，多次调用 append 将会添加多个具有相同名称的字段。

还有一个 set 方法，语法与 append 相同。不同之处在于 .set 移除所有具有给定 name 的字段，然后附加一个新字段。因此，它确保了只有一个具有这种 name 的字段，其他的和 append 一样：

## Fetch：下载进度

fetch 方法允许去跟踪 下载 进度。

请注意：到目前为止，fetch 方法无法跟踪 上传 进度。对于这个目的，请使用 XMLHttpRequest，我们在后面章节会讲到。

要跟踪下载进度，我们可以使用 `response.body` 属性。它是 `ReadableStream` —— 一个特殊的对象，它可以逐块（chunk）提供 body。在 `Streams API` 规范中有对 `ReadableStream` 的详细描述。

与 `response.text()`，`response.json()` 和其他方法不同，`response.body` 给予了对进度读取的完全控制，我们可以随时计算下载了多少。

这是从 response.body 读取 response 的示例代码：

```JS
// 代替 response.json() 以及其他方法
const reader = response.body.getReader();

// 在 body 下载时，一直为无限循环
while(true) {
  // 当最后一块下载完成时，done 值为 true
  // value 是块字节的 Uint8Array
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

`await reader.read()` 调用的结果是一个具有两个属性的对象：

- `done` —— 当读取完成时为 true，否则为 false。
- `value` —— 字节的类型化数组：Uint8Array。

**请注意：**
Streams API 还描述了如果使用 for await..of 循环异步迭代 ReadableStream，但是目前为止，它还未得到很好的支持（参见 [浏览器问题](https://github.com/whatwg/streams/issues/778#issuecomment-461341033)），所以我们使用了 while 循环。

这是获取响应，并在控制台中记录进度的完整工作示例，下面有更多说明：

```js
// Step 1：启动 fetch，并获得一个 reader
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100');

const reader = response.body.getReader();

// Step 2：获得总长度（length）
const contentLength = +response.headers.get('Content-Length');

// Step 3：读取数据
let receivedLength = 0; // 当前接收到了这么多字节
let chunks = []; // 接收到的二进制块的数组（包括 body）
while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`)
}

// Step 4：将块连接到单个 Uint8Array
let chunksAll = new Uint8Array(receivedLength); // (4.1)
let position = 0;
for(let chunk of chunks) {
  chunksAll.set(chunk, position); // (4.2)
  position += chunk.length;
}

// Step 5：解码成字符串
let result = new TextDecoder("utf-8").decode(chunksAll);

// 我们完成啦！
let commits = JSON.parse(result);
alert(commits[0].author.login);
```

让我们一步步解释下这个过程：

1. 我们像往常一样执行 fetch，但不是调用 response.json()，而是获得了一个流读取器（stream reader）`response.body.getReader()`。

2. 在读取数据之前，我们可以从 `Content-Length header` 中得到完整的响应长度。

    - 跨源请求中可能不存在这个 header（请参见 [Fetch：跨源请求](https://zh.javascript.info/fetch-crossorigin)），并且从技术上讲，服务器可以不设置它。但是通常情况下它都会在那里。

3. 调用 `await reader.read()`，直到它完成。

    - 我们将响应块收集到数组 chunks 中。这很重要，因为在使用完（consumed）响应后，我们将无法使用 `response.json()` 或者其他方式（你可以试试，将会出现 error）去“重新读取”它。
4. 最后，我们有了一个 `chunks` —— 一个 `Uint8Array` 字节块数组。我们需要将这些块合并成一个结果。但不幸的是，没有单个方法可以将它们串联起来，所以这里需要一些代码来实现：

    - 我们创建 `chunksAll = new Uint8Array(receivedLength)` —— 一个具有所有数据块合并后的长度的同类型数组。
    - 然后使用 `.set(chunk, position)` 方法，从数组中一个个地复制这些 chunk。

5. 我们的结果现在储存在 chunksAll 中。但它是一个字节数组，不是字符串。

要创建一个字符串，我们需要解析这些字节。可以使用内建的 TextDecoder 对象完成。然后，我们可以 JSON.parse 它，如果有必要的话。

如果我们需要的是二进制内容而不是字符串呢？这更简单。用下面这行代码替换掉第 4 和第 5 步，这行代码从所有块创建一个 Blob： ```let blob = new Blob(chunks);```

## Fetch：中止（Abort）

正如我们所知道的，fetch 返回一个 promise。**JavaScript 通常并没有“中止” promise 的概念**。那么我们怎样才能取消一个正在执行的 fetch 呢？例如，如果用户在我们网站上的操作表明不再需要 fetch。

为此有一个特殊的内建对象：AbortController。它不仅可以中止 fetch，还可以中止其他异步任务。

### AbortController 对象

创建一个控制器（controller）：

```let controller = new AbortController();```

控制器是一个极其简单的对象。

- 它具有单个方法 abort()，
- 和单个属性 signal，我们可以在这个属性上设置事件监听器。

当 abort() 被调用时：

- controller.signal 就会触发 abort 事件。
- controller.signal.aborted 属性变为 true。

通常，处理分为两部分：

1. 一部分是一个可取消的操作，它在 controller.signal 上设置一个监听器。
2. 另一部分是取消：在需要的时候调用 controller.abort()。

这是完整的示例（目前还没有 fetch）：

```JS
let controller = new AbortController();
let signal = controller.signal;

// 可取消的操作这一部分
// 获取 "signal" 对象，
// 并将监听器设置为在 controller.abort() 被调用时触发
signal.addEventListener('abort', () => alert("abort!"));

// 另一部分，取消（在之后的任何时候）：
controller.abort(); // 中止！

// 事件触发，signal.aborted 变为 true
alert(signal.aborted); // true
```

正如我们所看到的，AbortController 只是在 abort() 被调用时传递 abort 事件的一种方式。

我们可以自己在代码中实现相同类型的事件监听，而根本不需要 AbortController 对象。

但是有价值的是，fetch 知道如何与 AbortController 对象一起工作，它们俩是集成在一起的。

### 与 fetch 一起使用

为了能够取消 fetch，请将 AbortController 的 signal 属性作为 fetch 的一个可选参数（option）进行传递：

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

fetch 方法知道如何与 AbortController 一起工作。它会监听 signal 上的 abort 事件。

现在，想要中止 fetch，调用 controller.abort() 即可：

当一个 fetch 被中止，它的 promise 就会以一个 error AbortError reject，因此我们应该对其进行处理，例如在 try..catch 中。

这是完整的示例，其中 fetch 在 1 秒后中止：

```js
// 1 秒后中止
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

### AbortController 是可伸缩的

AbortController 是可伸缩的，它允许一次取消多个 fetch。

这是一个代码草稿，该代码并行 fetch 很多 urls，并使用单个控制器将其全部中止：

```js
let urls = [...]; // 要并行 fetch 的 url 列表

let controller = new AbortController();

// 一个 fetch promise 的数组
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// 如果 controller.abort() 被从其他地方调用，
// 它将中止所有 fetch
```

如果我们有自己的与 fetch 不同的异步任务，我们可以使用单个 AbortController 中止这些任务以及 fetch。

在我们的任务中，我们只需要监听其 abort 事件：

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 我们的任务
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// 等待完成我们的任务和所有 fetch
let results = await Promise.all([...fetchJobs, ourJob]);

// 如果 controller.abort() 被从其他地方调用，
// 它将中止所有 fetch 和 ourJob
```

## Fetch：跨源请求

### 简单请求

有两种类型的跨源请求：

1. 简单的请求。
2. 所有其他请求。

一个 简单的请求 是指满足以下两个条件的请求：

1. [简单的方法](https://fetch.spec.whatwg.org/#simple-method)：GET，POST 或 HEAD
2. [简单的 header](https://fetch.spec.whatwg.org/#simple-header) —— 仅允许自定义下列 header：

    - Accept，
    - Accept-Language，
    - Content-Language，
    - Content-Type 的值为 application/x-www-form-urlencoded，multipart/form-data 或 text/plain。

任何其他请求都被认为是“非简单请求”。例如，具有 PUT 方法或 API-Key HTTP-header 的请求就不是简单请求。

**本质区别在于，可以使用 `<form> 或 <script>` 进行“简单请求”，而无需任何其他特殊方法。**

因此，即使是非常旧的服务器也能很好地接收简单请求。

与此相反，带有非标准 header 或者例如 DELETE 方法的请求，无法通过这种方式创建。在很长一段时间里，JavaScript 都不能进行这样的请求。所以，旧的服务器可能会认为此类请求来自具有特权的来源（privileged source），“因为网页无法发送它们”。

当我们尝试发送一个非简单请求时，浏览器会发送一个特殊的“预检（preflight）”请求到服务器 —— 询问服务器，你接受此类跨源请求吗？

并且，除非服务器明确通过 header 进行确认，否则非简单请求不会被发送。

现在，我们来详细介绍它们。

#### 用于简单请求的 CORS

如果一个请求是跨源的，浏览器始终会向其添加 Origin header。

服务器可以检查 Origin，如果同意接受这样的请求，就会在响应中添加一个特殊的 header Access-Control-Allow-Origin。该 header 包含了允许的源（在我们的示例中是 https://javascript.info），或者一个星号 *。然后响应成功，否则报错。

浏览器在这里扮演受被信任的中间人的角色：

1. 它确保发送的跨源请求带有正确的 Origin。
2. 它检查响应中的许可 Access-Control-Allow-Origin，如果存在，则允许 JavaScript 访问响应，否则将失败并报错。

![](https://zh.javascript.info/article/fetch-crossorigin/xhr-another-domain.svg)

#### Response header

对于跨源请求，默认情况下，JavaScript 只能访问“简单” response header：

- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

访问任何其他 response header 都将导致 error。

要授予 JavaScript 对任何其他 response header 的访问权限，服务器必须发送 `Access-Control-Expose-Headers` header。它包含一个以逗号分隔的应该被设置为可访问的非简单 header 名称列表。

```json
200 OK
Content-Type:text/html; charset=UTF-8
Content-Length: 12345
API-Key: 2c9de507f2c54aa1
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Expose-Headers: Content-Length,API-Key
```

### “非简单”请求

我们可以使用任何 HTTP 方法：不仅仅是 GET/POST，也可以是 PATCH，DELETE 及其他。

之前，没有人能够设想网页能发出这样的请求。因此，可能仍然存在有些 Web 服务将非标准方法视为一个信号：“这不是浏览器”。它们可以在检查访问权限时将其考虑在内。

因此，为了避免误解，任何“非标准”请求 —— 浏览器不会立即发出在过去无法完成的这类请求。即在它发送这类请求前，会先发送“预检（preflight）”请求来请求许可。

预检请求使用 OPTIONS 方法，它没有 body，但是有两个 header：

- `Access-Control-Request-Method` header 带有非简单请求的方法。
-` Access-Control-Request-Headers` header 提供一个以逗号分隔的非简单 HTTP-header 列表。

如果服务器同意处理请求，那么它会进行响应，此响应的状态码应该为 200，没有 body，具有 header：

- `Access-Control-Allow-Origin` 必须为 * 或进行请求的源（例如 https://javascript.info）才能允许此请求。
- `Access-Control-Allow-Methods` 必须具有允许的方法。
-` Access-Control-Allow-Headers` 必须具有一个允许的 header 列表。
- 另外，header `Access-Control-Max-Age` 可以指定缓存此权限的秒数。因此，浏览器不是必须为满足给定权限的后续请求发送预检。

![](https://zh.javascript.info/article/fetch-crossorigin/xhr-preflight.svg)

### 凭据（Credentials）

默认情况下，由 JavaScript 代码发起的跨源请求不会带来任何凭据（cookies 或者 HTTP 认证（HTTP authentication））。

这对于 HTTP 请求来说并不常见。通常，对 http://site.com 的请求附带有该域的所有 cookie。但是由 JavaScript 方法发出的跨源请求是个例外。

例如，fetch('http://another.com') 不会发送任何 cookie，即使那些 (!) 属于 another.com 域的 cookie。

为什么？

这是因为具有凭据的请求比没有凭据的请求要强大得多。如果被允许，它会使用它们的凭据授予 JavaScript 代表用户行为和访问敏感信息的全部权力。

服务器真的这么信任这种脚本吗？是的，它必须显式地带有允许请求的凭据和附加 header。

要在 fetch 中发送凭据，我们需要添加 credentials: "include" 选项，像这样：

```JS
fetch('http://another.com', {
  credentials: "include"
});
```

现在，fetch 将把源自 another.com 的 cookie 和我们的请求发送到该网站。

如果服务器同意接受 带有凭据 的请求，则除了 Access-Control-Allow-Origin 外，服务器还应该在响应中添加 header Access-Control-Allow-Credentials: true。

### 总结

从浏览器角度来看，有两种跨源请求：“简单”请求和其他请求。

简单请求 必须满足下列条件：

- 方法：GET，POST 或 HEAD。
- header —— 我们仅能设置：
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type 的值为 application/x-www-form-urlencoded，multipart/form-data 或 text/plain。

简单请求和其他请求的本质区别在于，自古以来使用 `<form> 或 <script>` 标签进行简单请求就是可行的，而长期以来浏览器都不能进行非简单请求。

所以，实际区别在于，简单请求会使用 Origin header 并立即发送，而对于其他请求，浏览器会发出初步的“预检”请求，以请求许可。

对于简单请求：

- → 浏览器发送带有源的 Origin header。
- ← 对于没有凭据的请求（默认不发送），服务器应该设置：
    - Access-Control-Allow-Origin 为 * 或与 Origin 的值相同

- ← 对于具有凭据的请求，服务器应该设置：
    - Access-Control-Allow-Origin 值与 Origin 的相同
    - Access-Control-Allow-Credentials 为 true

此外，要授予 JavaScript 访问除 Cache-Control，Content-Language，Content-Type，Expires，Last-Modified 或 Pragma 外的任何 response header 的权限，服务器应该在 header Access-Control-Expose-Headers 中列出允许的那些 header。

对于非简单请求，会在请求之前发出初步“预检”请求：

- → 浏览器将具有以下 header 的 OPTIONS 请求发送到相同的 URL：
    - Access-Control-Request-Method 有请求方法。
    - Access-Control-Request-Headers 以逗号分隔的“非简单” header 列表。

- ← 服务器应该响应状态码为 200 和 header：
    - Access-Control-Allow-Methods 带有允许的方法的列表，
    - Access-Control-Allow-Headers 带有允许的 header 的列表，
    - Access-Control-Max-Age 带有指定缓存权限的秒数。

- 然后，发出实际请求，应用先前的“简单”方案。

