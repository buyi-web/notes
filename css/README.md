# CSS

## BFC

[什么是BFC]（https://www.cnblogs.com/libin-1/p/7098468.html）

W3C 对 BFC 定义：

>浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及 overflow 值不为“visiable”的块级盒子，都会为他们的内容创建新的 BFC（块级格式上下文）

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

BFC 作用：

1. 利用 BFC 避免外边距折叠
2. 清除内部浮动 （撑开高度）
  原理: 触发父 div 的 BFC 属性，使下面的子 div 都处在父 div 的同一个 BFC 区域之内
3. 避免文字环绕
4. 分属于不同的 BFC 时，可以阻止 margin 重叠
5. 多列布局中使用 BFC

如何生成 BFC：（脱离文档流，满足下列的任意一个或多个条件即可）

1. 根元素，即 HTML 元素（最大的一个 BFC）
2. float 的值不为 none
3. position 的值为 absolute 或 fixed
4. overflow 的值不为 visible（默认值。内容不会被修剪，会呈现在元素框之外）
5. display 的值为 inline-block、table-cell、table-caption

BFC 布局规则：

1. 内部的 Box 会在垂直方向，一个接一个地放置。
2. 属于同一个 BFC 的两个相邻的 Box 的 margin 会发生重叠
3. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响 到外面的元素。反之也如此, 文字环绕效果，设置 float
4. BFC 的区域不会与 float box 重叠。
5. 计算 BFC 的高度，浮动元素也参与计算

## 清楚浮动

方法一：让父元素变为一个 BFC。 父元素 overflow: auto/hidden。 让父元素去关注里面的高度。 必须定义 width 或 zoom:1，同时不能定义 height，使用 overflow:auto 时，浏览器会自动检查浮动区域的高度

方法二： 使用伪元素清楚浮动

```css
.clearfix::after {
  content: " ";
  clear: both;
  display: block;
  visibility: hidden;
  height: 0;
}
```

## inline-block 的间隙

两个并列的 inline-block 中间会有一条裂缝，这个的原因是两个标签之间有空格，浏览器把这些空格当成文字中空格，所以这两个块中间多少有间隙。

解决办法：

1. 删除两个标签间的空格，但是这样 html 排版不好
2. 容器元素 font-size: 0 然后再在里面再重新设置字体大小

## 你对 line-height 是如何理解的？

- line-height 指一行字的高度，包含了字间距，实际上是下一行基线到上一行基线距离
- 如果一个标签没有定义 height 属性，那么其最终表现的高度是由 line-height 决定的
- 一个容器没有设置高度，那么撑开容器高度的是 line-height 而不是容器内的文字内容
- 把 line-height 值设置为 height 一样大小的值可以实现单行文字的垂直居中
- line-height 和 height 都能撑开一个高度，height 会触发 haslayout（一个低版本 IE 的东西），而 line-height 不会

## 文本溢出显示省略号

单行文本溢出显示省略号：

```css
{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: no-wrap;
}
```

多行文本溢出显示省略号：

```css
{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; // 行数
    -webkit-box-orient: vertical;
}
```

## display: none; 与 visibility: hidden; opacity：0 的区别

结构

- display:none
  - 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击，
- visibility: hidden
  - 不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击
- opacity: 0
  - 不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击

继承

- display: none 和 opacity: 0
  - 非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。
- visibility: hidden
  - 继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式。

性能

- display:none
  - 修改元素会造成文档回流。读屏器不会读取 display: none 元素内容，性能消耗较大
- visibility:hidden
  - 修改元素只会造成本元素的重绘,性能消耗较少。读屏器读取 visibility: hidden 元素内容
- opacity: 0
  - 修改元素会造成重绘，性能消耗较少

相同点： 它们都能让元素不可见、他们都依然可以被 JS 所获取到

## 外边距折叠(collapsing margins)

相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。 这种合并外边距的方式被称为折叠，结合而成的外边距称为折叠外边距

折叠结果遵循下列计算规则：

- 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值
- 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值
- 两个外边距一正一负时，折叠结果是两者的相加的和

新手在做导航栏的时候发现页面整体掉下来一截就是这个原因。

## CSS 单位

1. px 绝对单位。传统上一个像素对应于计算机屏幕上的一个点，而对于高清屏则对应更多。
2. % 父元素宽度的比例。
  i. 如果对 html 元素设置 font-size 为百分比值，则是以浏览器默认的字体大小 16px 为参照计算的（所有浏览器的默认字体大小都为 16px），如 62.5%即等于 10px（62.5% * 16px = 10px）。
3. em 相对单位。 不同的属性有不同的参照值。
  i. 对于字体大小属性（font-size）来说，em 的计算方式是相对于父元素的字体大小
  ii. border, width, height, padding, margin, line-height）在这些属性中，使用 em 单位的计算方式是参照该元素的 font-size，1em 等于该元素设置的字体大小。同理如果该元素没有设置，则一直向父级元素查找，直到找到，如果都没有设置大小，则使用浏览器默认的字体大小。
4. rem 是相对于根元素 html 的 font-size 来计算的，所以其参照物是固定的。
  i. 好处：rem 只需要修改 html 的 font-size 值即可达到全部的修改，即所谓的牵一发而动全身。
5. vw, vh, vmin, vmax 相对单位，是基于视窗大小（浏览器用来显示内容的区域大小）来计算的。
  i. vw：基于视窗的宽度计算，1vw 等于视窗宽度的百分之一
  ii. vh：基于视窗的高度计算，1vh 等于视窗高度的百分之一
  iii. vmin：基于 vw 和 vh 中的最小值来计算，1vmin 等于最小值的百分之一
  iv. vmax：基于 vw 和 vh 中的最大值来计算，1vmax 等于最大值的百分之一

## CSS 预处理器

- 嵌套
  - 反映层级和约束
- 变量和计算
  - 减少冗余代码
- entend 和 mixin
  - 代码片段重用
  - mixin 是直接把 CSS 代码每个地方重复写一份
  - extend 是使用逗号分割的选择器来为多个不同的地方使用同一段 CSS
- 循环
  - 适用于复杂有规律的样式
- import
  - CSS 模块化

## CSS 优化、提高性能的方法有哪些？

- 多个 css 合并，尽量减少 HTTP 请求
- css 雪碧图
- 抽取公共样式，减少代码量
- 选择器优化嵌套，尽量避免层级过深 （用‘>’替换‘ ’）
- 属性值为 0 时，不加单位
- 压缩 CSS 代码
- 避免使用 [CSS 表达式](http://www.divcss5.com/css3-style/c50224.shtml)
它们要计算成千上万次并且可能会对你页面的性能产生影响。

## [DOM 层级顺序与 z-index](https://segmentfault.com/a/1190000014382426)

## rgba() 和 opacity 的透明效果有什么不同？

- opacity 作用于元素以及元素内的所有内容（包括文字）的透明度
- rgba() 只作用于元素自身的颜色或其背景色，子元素不会继承透明效果

## 请列举几种隐藏元素的方法

- visibility: hidden; 这个属性只是简单的隐藏某个元素，但是元素占用的空间任然存在
- opacity: 0; CSS3 属性，设置 0 可以使一个元素完全透明
- position: absolute; 设置一个很大的 left 负值定位，使元素定位在可见区域之外
- display: none; 元素会变得不可见，并且不会再占用文档的空间。
- transform: scale(0); 将一个元素设置为缩放无限小，元素将不可见，元素原来所在的位置将被保留
- `<div hidden="hidden">` HTML5 属性,效果和 display:none;相同，但这个属性用于记录一个元素的状态
- height: 0; 将元素高度设为 0 ，并消除边框
- filter: blur(0); CSS3 属性，将一个元素的模糊度设置为 0

## base64 的使用

- 写入 CSS， 减少 HTTP 请求
- 适用于小图片
- base64 的体积约为原图 4/3

## less和sass的区别

1. Less和Sass的主要不同就是他们的实现方式。
    - Less是基于JavaScript，是在客户端处理的。
    - Sass是基于Ruby的，是在服务器端处理的。
2. 关于变量在Less和Sass中的唯一区别就是Less用@，Sass用$。

[面试必看：less与sass的区别](https://www.jianshu.com/p/029792f0c97d)
