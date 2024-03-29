# ArrayBuffer，二进制数组

在 Web 开发中，当我们处理文件时（创建，上传，下载），经常会遇到二进制数据。另一个典型的应用场景是图像处理。

这些都可以通过 JavaScript 进行处理，而且二进制操作性能更高。

不过，在 JavaScript 中有很多种二进制数据格式，会有点容易混淆。仅举几个例子：

ArrayBuffer，Uint8Array，DataView，Blob，File 及其他。

与其他语言相比，JavaScript 中的二进制数据是以非标准方式实现的。

**基本的二进制对象是 ArrayBuffer —— 对固定长度的连续内存空间的引用。**

```let buffer = new ArrayBuffer(16); // 创建一个长度为 16 的 buffer```

它会分配一个 16 字节的连续内存空间，并用 0 进行预填充。

**注意：ArrayBuffer 不是某种东西的数组**

让我们先澄清一个可能的误区。ArrayBuffer 与 Array 没有任何共同之处：

- 它的长度是固定的，我们无法增加或减少它的长度。
- 它正好占用了内存中的那么多空间。
- 要访问单个字节，需要另一个“视图”对象，而不是 buffer[index]。

ArrayBuffer 是一个内存区域。它里面存储了什么？无从判断。只是一个原始的字节序列。

**如要操作 ArrayBuffer，我们需要使用“视图”对象。**

视图对象本身并不存储任何东西。它是一副“眼镜”，透过它来解释存储在 ArrayBuffer 中的字节。

例如：

- Uint8Array —— 将 ArrayBuffer 中的每个字节视为 0 到 255 之间的单个数字（每个字节是 8 位，因此只能容纳那么多）。这称为 “8 位无符号整数”。
- Uint16Array —— 将每 2 个字节视为一个 0 到 65535 之间的整数。这称为 “16 位无符号整数”。
- Uint32Array —— 将每 4 个字节视为一个 0 到 4294967295 之间的整数。这称为 “32 位无符号整数”。
- Float64Array —— 将每 8 个字节视为一个 5.0x10-324 到 1.8x10308 之间的浮点数。

因此，一个 16 字节 ArrayBuffer 中的二进制数据可以解释为 16 个“小数字”，或 8 个更大的数字（每个数字 2 个字节），或 4 个更大的数字（每个数字 4 个字节），或 2 个高精度的浮点数（每个数字 8 个字节）。

![](https://zh.javascript.info/article/arraybuffer-binary-arrays/arraybuffer-views.svg)

ArrayBuffer 是核心对象，是所有的基础，是原始的二进制数据。

但是，如果我们要写入值或遍历它，基本上几乎所有操作 —— 我们必须使用视图（view），例如：

```js
let buffer = new ArrayBuffer(16); // 创建一个长度为 16 的 buffer

let view = new Uint32Array(buffer); // 将 buffer 视为一个 32 位整数的序列

alert(Uint32Array.BYTES_PER_ELEMENT); // 每个整数 4 个字节

alert(view.length); // 4，它存储了 4 个整数
alert(view.byteLength); // 16，字节中的大小

// 让我们写入一个值
view[0] = 123456;

// 遍历值
for(let num of view) {
  alert(num); // 123456，然后 0，0，0（一共 4 个值）
}
```

## TypedArray

所有这些视图（Uint8Array，Uint32Array 等）的通用术语是 TypedArray。它们都享有同一组方法和属性。

请注意，没有名为 TypedArray 的构造器，它只是表示 ArrayBuffer 上的视图之一的通用总称术语：

类型化数组的行为类似于常规数组：具有索引，并且是可迭代的。

一个类型化数组的构造器（无论是 Int8Array 或 Float64Array，都无关紧要），其行为各不相同，并且取决于参数类型。

参数有 5 种变体：

```JS
new TypedArray(buffer, [byteOffset], [length]);
new TypedArray(object);
new TypedArray(typedArray);
new TypedArray(length);
new TypedArray();
```

如要访问 ArrayBuffer，可以用以下属性：

- arr.buffer —— 引用 ArrayBuffer。
- arr.byteLength —— ArrayBuffer 的长度。

我们可以从一个视图转到另一个视图：

```js
let arr8 = new Uint8Array([0, 1, 2, 3]);

// 同一数据的另一个视图
let arr16 = new Uint16Array(arr8.buffer);
```

**注意：**

>没有 int8 或类似的单值类型
请注意，尽管有类似 Int8Array 这样的名称，但 JavaScript 中并没有像 int，或 int8 这样的单值类型。
这是合乎逻辑的，因为 Int8Array 不是这些单值的数组，而是 ArrayBuffer 上的视图。

## 越界行为

我们尝试将 256 放入 Uint8Array。256 的二进制格式是 100000000（9 位），但 Uint8Array 每个值只有 8 位，因此可用范围为 0 到 255。

对于更大的数字，仅存储最右边的（低位有效）8 位，其余部分被切除：

![](https://zh.javascript.info/article/arraybuffer-binary-arrays/8bit-integer-256.svg)

因此结果是 0。

## TypedArray 方法

TypedArray 具有常规的 Array 方法，但有个明显的例外。

我们可以遍历（iterate），map，slice，find 和 reduce 等。

但有几件事我们做不了：

- 没有 splice —— 我们无法“删除”一个值，因为类型化数组是缓冲区（buffer）上的视图，并且缓冲区（buffer）是固定的、连续的内存区域。我们所能做的就是分配一个零值。
- 无 concat 方法。

还有两种其他方法：

- arr.set(fromArr, [offset]) 从 offset（默认为 0）开始，将 fromArr 中的所有元素复制到 arr。
- arr.subarray([begin, end]) 创建一个从 begin 到 end（不包括）相同类型的新视图。这类似于 slice 方法（同样也支持），但不复制任何内容 —— 只是创建一个新视图，以对给定片段的数据进行操作

## DataView

DataView 是在 ArrayBuffer 上的一种特殊的超灵活“未类型化”视图。它允许以任何格式访问任何偏移量（offset）的数据。

- 对于类型化的数组，构造器决定了其格式。整个数组应该是统一的。第 i 个数字是 arr[i]。
通过 DataView，我们可以使用 .getUint8(i) 或 .getUint16(i) 之类的方法访问数据。我们在- 调用方法时选择格式，而不是在构造的时候。

```new DataView(buffer, [byteOffset], [byteLength])```

- buffer —— 底层的 ArrayBuffer。与类型化数组不同，DataView 不会自行创建缓冲区（buffer）。我们需要事先准备好。
- byteOffset —— 视图的起始字节位置（默认为 0）。
- byteLength —— 视图的字节长度（默认至 buffer 的末尾）。

例如，这里我们从同一个 buffer 中提取不同格式的数字：

```JS
// 4 个字节的二进制数组，每个都是最大值 255
let buffer = new Uint8Array([255, 255, 255, 255]).buffer;

let dataView = new DataView(buffer);

// 在偏移量为 0 处获取 8 位数字
alert( dataView.getUint8(0) ); // 255

// 现在在偏移量为 0 处获取 16 位数字，它由 2 个字节组成，一起解析为 65535
alert( dataView.getUint16(0) ); // 65535（最大的 16 位无符号整数）

// 在偏移量为 0 处获取 32 位数字
alert( dataView.getUint32(0) ); // 4294967295（最大的 32 位无符号整数）

dataView.setUint32(0, 0); // 将 4 个字节的数字设为 0，即将所有字节都设为 0
```

当我们将混合格式的数据存储在同一缓冲区（buffer）中时，DataView 非常有用。例如，当我们存储一个成对序列（16 位整数，32 位浮点数）时，用 DataView 可以轻松访问它们。

## 总结

ArrayBuffer 是核心对象，是对固定长度的连续内存区域的引用。

几乎任何对 ArrayBuffer 的操作，都需要一个视图。

它可以是 TypedArray：
- Uint8Array，Uint16Array，Uint32Array —— 用于 8 位、16 位和 32 位无符号整数。
- Uint8ClampedArray —— 用于 8 位整数，在赋值时便“固定”其值。
- Int8Array，Int16Array，Int32Array —— 用于有符号整数（可以为负数）。
- Float32Array，Float64Array —— 用于 32 位和 64 位的有符号浮点数。
- 或 DataView —— 使用方法来指定格式的视图，例如，getUint8(offset)。

在大多数情况下，我们直接对类型化数组进行创建和操作，而将 ArrayBuffer 作为“通用标识符（common discriminator）”隐藏起来。我们可以通过 .buffer 来访问它，并在需要时创建另一个视图。

还有另外两个术语，用于对二进制数据进行操作的方法的描述：

- `ArrayBufferView` 是所有这些视图的总称。
- `BufferSource` 是 ArrayBuffer 或 ArrayBufferView 的总称。