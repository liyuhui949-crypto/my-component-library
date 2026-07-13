ES6新特性有哪些？

1. 新增了块级作用域的概念，使用let和const定义，新增了数据类型bigInt和Symbol，也能定义箭头函数，该函数不会创建this，this指向外层作用域的this。还有使用new关键字实例化的键值对结合Map以及不重复值的集合Set，使用for of进行遍历
2. 还新增了Promise用于解决异步回调地狱问题，并在之后的ES8中开发了语法糖async和await，搭配try catch作为异步的终极答案
3. 规范了模块化的概念，使用import和export作为导入和导出
4. 还有一些好用的小语法糖，模板字符串、解构赋值、...展开运算符、...arges剩余参数
5. 新增了很多字符串、数组、对象方法以及类编程（Class）
6. 新增了Proxy元编程，是vue3响应式系统实现的基石

字符串、数组、对象的常用方法？

字符串：slice截取字符串、splice分割为数组，includes是否包含某字符串、toUpperCase转大写、toLowerCase转小写、trim去除首位空格

数组：Array.isArray判断是否为数组、Array.form实例化为数组、.map返回新数组，.forEach循环遍历该数组，.flter过滤数组，.includes是否包含某个数、.some是否有某个值满足条件、.findeIndex查找某数据的index（没有则返回-1）、.reduce累加数组值、.pop弹出最后一位数据、.shift首位删除数据、.push从后添加数组、.unshift首位添加数据、.fill填充数组（搭配Array.form使用），.slect截取数组，.join转化为字符串

对象：Object.keys输出key组成的数组、.values输出value组成的数组，.extries输出键值对组成的数据

Promise有哪些需要了解的？
三种状态，待确认、成功、失败，状态一旦确认则不可逆
使用resolve和reject返回成功和失败，使用.then和.catch方法接受成功/失败状态
.then会默认返回新的Promis，该方法不传参数则会透传到下一个.then方法，可以链式调用解决回调地狱
Promise.all并发请求，发送里面的所有异步请求，若一个失败则返回失败结果
Promise.any并发请求，任意一个成功即可，全部失败则返回失败结果
Promise.race，竞态并发，谁最先响应则返回谁的状态

原型对象与原型链？
原型对象是实例对象身上特殊对象，包括一些静态属性、方法以及它的构造函数
原型链就是一层一层的向上查找，直到Object，Object最终指向null

闭包，内存泄漏？
闭包是一个数据定义和它的应用组成的函数，实现了数据私有化，实例对象无法修改该定义的值
引用后没有手动置空，则可能造成内存泄漏（浏览器的引用计数法无法清理）

改变 this 指向？
.call方法，立即执行
.apply方法，不立即执行

如何准确判断数据类型？
type of、Array.isArray
Object.prototype.toString.call(value)

手写防抖和节流？

怎么解决浮点数精度问题？

js的堆和栈？
堆存放基本数据类型和this执行
栈存放方法，对象等

文件上传、下载的数据格式？执行过程
上传文件一般使用formeData格式数据，需要指定请求头type为FormDate格式
下载数据返回二进制，bolo

fetch特性？
需要使用isOk判断请求是否成功
流式传输，需要进行josn进行实例化（异步）

类？
使用new关键字实例化
内置属性、方法，性能比挂载到原型上更强
