---
title: 前端面试题
author: 王小明
date: 2025-12-27
---

# 场景题

<script setup>
import Javascriptfoundation from "@components/Javascriptfoundation.vue"
</script>

## 性能优化的手段有哪些

1. vue路由懒加载、组件懒加载、keep alive缓存组件、组件可视区展示、第三方库按需引入而不是全局引入
2. 配置 http 缓存头，静态资源缓存、升级为 http2（http请求头） 或者 http3（udp协议）用以解决队头消息阻塞问题
3. 打包优化：分包策略，减少重复打包并且不改变文件指纹，减少浏览器需要重新加载的文件数量、主包体积过大，可以使用CND方式引入
4. 大文件使用本地存储，超过5mb的文件放在 IndexDB 中
5. 谷歌浏览器使用 Lighthouse 进行网页性能检测，查看LCP（最大内容渲染时间）、CLS（页面元素抖动）、TBT（主线程被阻塞时间）指标，根据分析报告做出针对性优化

## 如何判断数据类型

1. typeof
2. Array.isArray()
3. isNaN()
4. `Object.prototype.toString()`方法：每个 JS 对象在 V8 底层创建时都被打上了不可变的内置类型标签（[[Class]]）。Object.prototype.toString 会直接读取这个标签，并对 null/undefined 做特殊处理，因此它能穿透所有子类的原型链重写，成为最准确的类型检测方法。

## 数组排序

## 数组去重

# 基础题

## null undefined NaN 0 '0' 转换为布尔值

## 作用域及作用域链

> 作用域可以理解为生效范围, 作用域链则是各级串联起的目录; 子级作用域可访问父级, 反之不行
> 作用域有优先级, 以某个 Function 为例, 本层作用域声明的定义 > 传入的参数 > 变量悬挂 > 外层作用域声明的定义 > window全局变量
> 变量悬挂: 代码执行前将变量和函数的声明提升到作用域顶部的行为

## 对象原型 原型对象 原型链

> 原型对象: 每个函数都有一个 prototype 属性，这个属性指向的对象就是原型对象
> 对象原型: 通过 Object.getPrototypeOf(对象实例) 或 对象实例.**proto** 的方式拿到, 指向

## this指向及改变this

> this 可以理解为上下文, 谁在执行, this 就执行谁; 构造函数的 this 指向的是该构造函数的实例对象, 普通函数的 this 指向的是 window, 对象内部的 this 指向的是该对象本身
> 改变 this 指向的方法:

```ts
call()：fun.call(thisArg,arg1,arg2,...)；不常使用
    - thisArg：在fun函数运行时指定的this值
    - arg1：传递的其他参数
    - 返回值就是函数的返回值，因为他就是调用函数
apply()：fun.call( thisArg,[argsArray] )；和call相似，但第二个参数要求必须是数组
bind()：常用
    - bind方法不会调用函数；
    - 返回由指定的this值和初始化参数改造的原函数拷贝（新函数）
    - 当只想改变this，不想调用函数时使用bind
```

## Promise

> 有三种状态, peddling fulfilled rejected , 状态确定后无法改变
> new Promise() 接受一个函数, 该函数有两个值, 响应成功的 resolve() 和响应失败的 reject()
> new Promise() 的实例对象通过 .then() 方法接受响应成功, 使用 .catch() 方法接受响应失败
> 注意! 只有该 Promise 的状态值确定后, 才会调用 .then() 或 .catch() 方法

## 解决回调地狱

> 使用 async await
> 或者 每个 .then() 方法里, return 一个新的 Promise 对象, 把获取的值 resolve 出去, 然后在上层对象后面接 .then()

## 防抖与节流

> 利用定时器限制事件触发频率
> 防抖(debounce): 单位时间内, 频繁触发事件, 只执行最后一次触发的事件; 每次触发事件就清除上一次的事件生成的定时器任务
> 节流(throttle): 单位时间内, 频繁触发事件, 执行完一次事件后, 再执行下一次; 没有定时器任务时, 才会生成, 定时器任务结束后才触发新的

## cookie和token的区别

```
Cookie是一种存储在用户浏览器中的小型文本文件，用于保存用户的会话信息和偏好设置。服务器通过HTTP头部将Cookie发送给客户端，客户端会在后续请求中将Cookie发送回服务器。
	通常每个Cookie大小限制为4KB
Token是一种身份验证的凭证，通常由服务器生成并发放给客户端，客户端在后续请求中使用Token进行身份验证。Token通常是一个加密字符串，包含用户信息和签名。
	没有严格限制，但通常比Cookie大

Cookie：主要用于会话管理和个性化设置，存储在浏览器中，通过HTTP头部传递，适用于简单的会话管理和跨页面的状态保持。
Token：主要用于API认证和安全通信，通常存储在LocalStorage或SessionStorage中，通过HTTP头部或请求参数传递，适用于前后端分离的应用和移动应用。
```

## 0.1+0.2===0.3 false

```
console.log(0.1 + 0.2 === 0.3);  ===> false
因为两数
```

## js的堆和栈

> 1. 堆(Heap)和栈(Stack)都是用于存储数据的
> 2. 以 js 为例, 基本类型数据 undefined null symbol 执行上下文(函数调用时的变量环境 this指向) 以及 对象的地址指针都存放在栈中; 而对象类型数据 闭包中的变量存放在堆中
> 3. 栈是后进先出, 自动释放内存; 堆通过垃圾回收机制管理内存, 闭包里的数据需要手动解除占用

## js的垃圾回收机制

> 1. 现代浏览器常用的是标记清除法, 就是会从 js 的根节点开始向下扫描，哪些堆资源不能访问了就会被标记清除

## vue 基础

### vue2 和 vue3 的区别

> 源码层面:
>
> 1. 响应式系统重写:
>    - vue2 通过静态方法 Object.defineProperty(), 重写响应式对象的 get() 和 set(); 通过 data 函数返回的基本数据类型的数据, 都会被包装成响应式对象
>    - vue3 通过 Proxy() 构造函数, 创建响应式对象的代理, 也就是 reactive; 如果是基本数据类型, 则通过 ref Api包装一个 .value 属性, 然后代理 .value 属性
>    - 两者的差别:
>      - Object.defineProperty 只能代理已经存在的属性，它是在对象初始化时对每个属性逐个进行代理的, 所以在 vue2 中新增属性需要通过 $set() 的方式重新运行一次代理过程; Proxy 代理的是整个对象，它拦截的是对对象的所有操作（包括新增、删除、枚举等），而不是某个属性
>      - Proxy 的性能更好
> 2. v-if 和 v-for 的优先级变化; 在 vue3 中, v-if 的优先级比 v-for 的高
>    使用层面:
>
> - 在 vue3.0, 推荐使用选项式API, 也就是 setup 函数, 在 vue3.2 更进一步, 推出了 script setup 语法糖
> - 在 vue3, 简化了使用子组件操作, 直接引入使用而无需注册; 生命周期里的 beforeCreate created 被 setup 替代, 其他生命周期名称也有所变化; 模板特性增强, 支持多个根元素
> - 新增 teleport(瞬移) 组件; 深度选择器语法 :deep(.className); vue3.4+ 新增 defineModel 函数, 是自定义事件和 props 的语法糖
> - 打包方面, 用 vite 取代 vue cli

## HTTP

### cookie和token的区别

> cookie 需要服务器验证, 能即时设置为过期状态; 浏览器后续请求自动携带 cookie
> token 一般存储手动做本地存储; 只能通过代码手动清除 token; 无需服务器验证, 后续请求需手动携带 token

| 特性             | Cookie-Based 认证                                      | Token-Based 认证 (如 JWT)                                              |
| :--------------- | :----------------------------------------------------- | :--------------------------------------------------------------------- |
| **本质**         | **一个状态记录**（Session ID），存储在客户端的Cookie中 | **一个自包含的凭证**（Token本身包含所有信息）                          |
| **存储位置**     | 由浏览器自动管理，存储在客户端的Cookie中               | 由开发者决定，通常存储在 localStorage、sessionStorage 或内存中         |
| **通信方式**     | **自动**：浏览器每次请求都会自动携带Cookie             | **手动**：需要在请求头（如 `Authorization: Bearer <token>`）中手动添加 |
| **服务器状态**   | **有状态（Stateful）**：服务器需要存储Session来验证ID  | **无状态（Stateless）**：服务器无需存储，只需验证Token签名即可         |
| **跨域（CORS）** | 需要额外配置（`withCredentials`、CORS策略）            | 天然支持跨域，只需配置正确的HTTP头                                     |
| **扩展性**       | 相对较差，依赖于服务器存储的Session                    | 非常好，适合分布式和微服务架构                                         |
| **安全性**       | 容易受到CSRF攻击（需要其他手段防护）                   | 容易受到XSS攻击（如果Token存储不当）                                   |
| **有效期控制**   | 由服务器端控制，可随时使某个Session失效                | 由Token自身过期时间控制，失效前无法轻易撤回                            |

### 文件的上传与下载

> 1. 上传: File 是从本地传文件到 JS，然后 JS 通过包装成 FormData 对象传给服务器

```css
[用户本地]
   ↓ 选择文件（input[type="file"]）
[前端 JS 中获得 File 对象]
   ↓ 包装成 FormData
[前端通过 fetch / axios 发送]
   ↓
[服务器接收到 multipart/form-data]
   ↓ 保存成文件 或 处理
```

> 2. 下载: 服务器通常返回 文件的二进制流（Blob / ArrayBuffer）或 Base64 编码

```ts
1. 在 axios 中可以通过 responseType 明确设置返回类型
axios('api/download',{
    method:'get',
    responseType: 'blob'
})

2. fetch 无法明确定义响应格式, 但是可以告诉浏览器我想要怎么处理响应的数据
const res = await fetch('api/download',{
    method:'get'
})
const data = await res.blob() // 转换为 data 对象
const data2 = await res.arrayBuffer() // 转换为 arrayBuffer 对象
const data3 = await res.text() // 转换为 text 对象
const data4 = await res.json() // 转换为 json 对象

!!! Fetch API 的响应体只能读取一次。如果需要多次使用同一响应的不同格式，应该先克隆响应
const res = await fetch('api/download',{
    method:'get'
})
const clone1 = res.clone()
const clone2 = res.clone()
const blobData = await res.blob()
const textData = await clone1.text()
const arrayBufferData = await clone2.arrayBuffer()
```

### Blob

> Blob(blobParts?, options?) 是一个构造函数, 它的的实例对象称为 Blob 对象
>
> ​ blobParts: 一个可迭代的对象, 如数组 ArrayBuffer Blob等
>
> ​ options: 配置项
>
> ​ type: 指定任意属性的对象
>
> ​ endings: 如果数据是文本, 那么如何解释其中的换行符
>
> Blob 对象表示一个不可变, 原始数据类型的类文件对象. 它的数据可以按文本或二进制的格式进行读取

> 实例属性:
> size: 返回字节数
> type: 返回文件的 MIME 类型

> 实例方法:
> arrayBuffer(): 无参数, 返回一个 Promise, 会兑现一个包含 blob 二进制数据内容的 ArrayBuffer
> text(): 无参数, 返回一个 Promise, 会兑现一个包含 blob 内容的 UTF-8 格式的字符串
> bytes(): 无参数, 返回一个 Promise, 会兑现一个包含 blob 内容的字节数组的 Unit8Array
> stream(): 无参数, 返回一个 ReadableStream 对象, 读取它将返回包含在 Blob 中的数据(Fetch接口通过Response的属性body)
> slice(start,end,contentType): 三个参数, 创建并返回一个新的 blob 对象, 该对象包含调用它的 blob 的子集中的数据
>
> - start: 起始索引 end:结束索引 contentType:赋予新的内容类型

```ts
const array = Array(1024).fill('1')
const blob = new Blob(array)
console.log(blob, "@blob")  ===>  Blob {size: 1024, type: ''}
```

### ArrayBuffer

> 是一个构造函数, 实例对象用来表示一段通用且固定长度的原始二进制数据
>
> ArrayBuffer(length?,options?)
>
> - 该构造函数有两个参数: ArrayBuffer(length,options); length: 字节大小; options: 一个配置对象, 有属性 maxByteLength, 可以设置可调整到的最大字节数, 推荐不超过 1gb, 减少内存溢出的风险
>   实例对象身上的属性及方法:
> - resize(): 将 ArrayBuffer 调整为指定的大小，以字节为单位
> - slice(): 返回一个新的 ArrayBuffer 实例，其包含原 ArrayBuffer 实例中从 begin 开始（包含）到 end 结束（不含）的所有字节的副本, 索引值从 0 开始
> - byteLength: 该数组缓冲区的长度（以字节为单位）
> - maxByteLength: 该数组缓冲区可调整到的最大长度（以字节为单位）。
> - resizable 此数组缓冲区是否可以调整大小, 返回布尔值

```ts
// 创建一个6字节大小的 buffer
const buffer = new ArrayBuffer(6, { maxByteLength: 16 })
console.log(buffer, "@buffer")  ===> ArrayBuffer(1024)
// 调整字节大小
buffer.resize(12)  // 需设置 maxByteLength 后才能使用, 否则会报错
// 返回切片副本
const newBuffer = buffer.slice(1, 6)
console.log(buffer.byteLength, "@byteLength")
console.log(buffer.maxByteLength, "@maxByteLength")
console.log(buffer.resizable, "@resizable")
console.log(newBuffer, "@newBuffer")
```

### Blob 和 ArrayBuffer 的应用场景

> Blob 对象表示一个类文件对象; ArrayBuffer 表示一组原始二进制数据
> Blob使用大部分的场景; ArrayBuffer 适用于需加密的数据和 WebSocket

### File

> File构造函数的实例对象成为 File 对象, 是一种特定类型的 Blob
>
> File 对象继承了 Blob 对象全部属性和方法, 并有自己特殊的两个属性
>
> File(fileBits,fileName,options?) 构造函数有三个参数
>
> - fileBits: 一个可迭代对象，例如一个具有 ArrayBuffer、TypedArray、DataView、Blob、字符串或任何此类元素的组合的数组，将被放入 File 内。请注意，这里的字符串被编码为 UTF-8，与通常的 JavaScript UTF-16 字符串不同
> - fileName: 表示文件名或文件路径的字符串
> - options
>   - type: 表示将放入文件的内容的 MIME 类型的字符串
>   - name: 只读属性, 返回文件名称
>   - lastModified: 只读属性, 文件上次修改日期, 时间戳格式

```ts
const array = Array(1024).fill('1')
const file = new File(array, 'file文件')
console.log(file, "@file")
===> File {name: 'file文件', lastModified: 1757038921785, lastModifiedDate: Fri Sep 05 2025 10:22:01 GMT+0800 (中国标准时间), webkitRelativePath: '', size: 1024, …}
```

### FormData()

> FormData(无参数) 是一个构造函数, 它的实例对象主要用于 HTTP 请求, 可以很轻松的将数据发送给后端; 不能直接 log, 因为浏览器控制台对 FormData 的序列化显示有限制

```ts
1. 实例方法
    - append(name,value,filename): 方法会添加一个新值到 FormData 对象内的一个已存在的键中，如果键不存在则会添加该键
        - name: value 中包含的数据对应的表单名称
        - value: 表单的值, 可以是 Blob 或 File
        - filename: 传给服务器的名称
            - 当第二个参数是 Blob 时, Blob 对象的默认文件名是 "blob", 设置了 filename 则以 filename 为主; File 对象的默认文件名是该文件的名称, 也以 filename 为主
    - set(name, value, filename): 方法会对 FormData 对象里的某个 key 设置一个新的值，如果该 key 不存在，则添加
        - 参数和 append 没有区别
        - set() 和 FormData.append 不同之处在于：如果某个 key 已经存在，set() 会直接覆盖所有该 key 对应的值，而 FormData.append 则是在该 key 的最后位置再追加一个值
    - delete(name): 方法会从 FormData 对象中删除指定键，即 key，和它对应的值，即 value
    - get(name): 方法用于返回 FormData 对象中和指定的键关联的第一个值，如果你想要返回和指定键关联的全部值，那么可以使用 getAll() 方法
    - getAll(name): 方法会返回该 FormData 对象指定 key 的所有值组成的数组
    - has(name): 方法会返回一个布尔值，表示该FormData对象是否含有某个 key
    - keys(): 该方法返回一个迭代器（iterator），遍历了该 formData 包含的所有 key，这些 key 是 USVString 对象
    - values(): 方法返回一个允许遍历 FormData 中所有值的迭代器。这些值是字符串或是 Blob 对象。
    - entries(): 方法返回一个 iterator对象，此对象可以遍历访问 FormData 中的键值对。其中键值对的键是一个字符串对象；值是一个字符串或者 Blob 对象
2. 注意!
    - new FormData() 的实例对象不能直接 log, 因为浏览器控制台对 FormData 的序列化显示有限制. ormData 主要用于 HTTP 请求，不是用于数据存储和展示
    - entries() keys() values() 返回的都是 可迭代的迭代器对象, 不能直接打印, 需要手动序列化, 即 [...formData.entries()]
```

### fetch

> Fetch API 的响应体是一个 ReadableStream，只能被读取一次; 第二次尝试读取会报错; 提供了一个全局的 fetch() 方法, 该方法被用于替代 xmlhttpsrequest
>
> ​ fetch(url,options)
>
> 相比 xhr, fetch() 上传文件流时不知道流的字节大小, 所以 fetch 不能直接监控响应进度, 但是不能监控请求进度, 可以上传切片的方式监控进度
>
> 响应体没有被读取，会导致内存泄漏！连接不会自动关闭，资源不会被释放; 即使不需要数据，也要消费掉响应体; 消费响应体 = 读取响应内容 + 释放资源
>
> 只有当请求 url 的格式错误错误或网络错误时, fetch 的请求才会被拒绝; 也就意味着服务器返回 404 505 等错误码, 也不会响应失败; 因此必须检查 response.ok 或 respons.status
>
> **fetch(url,options)**; 在 Fetch API 中，无论是 GET 还是 POST 请求，所有要发送的数据都是通过 body 参数传递的, 所以需要手动拼接查询参数到路径上
>
> 一般会用到 Respon 接口的实例属性和方法
>
> 1. response.body: 只读属性, 暴露响应体内容的 ReadableStream, 这是响应体的内容
> 2. response.ok: 包含一个布尔值，表明响应是否成功(状态码在 200-299 范围内)
> 3. response.redirected: 返回一个布尔值, 如果本次请求响应来自重定向, 那么将返回 true
> 4. response.status: 本次响应返回的状态码
> 5. response.json(): 接受 response 流, 并将其读取完成. 返回一个 Promise, resolve 结果是将文本解析为 JSON
> 6. response.text() response.blob() response.arrayBuffer(): 和 json() 差不多

```ts
// 1. JSON数据（最常见）
const data = await response.json();

// 2. 文本数据
const text = await response.text();

// 3. 二进制数据（如图片、文件）
const blob = await response.blob();
const buffer = await response.arrayBuffer();

// 4. 如果不需要响应内容，但也要释放资源
await response.arrayBuffer(); // 最快的方式消费掉

// 根据Content-Type选择解析方式
const contentType = response.headers.get("content-type") || "";

if (contentType.includes("application/json")) {
  return await response.json();
} else if (contentType.includes("text/")) {
  return await response.text();
} else {
  return await response.blob();
}

// fetch常见的 options 配置项
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});
```

### WebSocket

WebSocket 是一种网络通信协议，允许在客户端和服务器之间建立持久的双向通信连接。它常用于实时应用程序，如在线游戏、聊天应用和实时数据更新，因为它允许服务器主动向客户端推送数据，而不需要客户端不断请求。

# 场景题

## 定时器为什么不靠谱

## 大文件分片上传和分片下载
