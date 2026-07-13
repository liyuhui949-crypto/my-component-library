## `Type Script`简介
#### 基础
1. `Type Script`是微软开发，基于`Java Script`的一个拓展语言
2. `Type Script`包含了`Java Script`的所有内容，是`Java Script`的超集
3. `Type Script`增加了：静态类型检查、接口、泛型等很多现代开发特性，更适合大型项目的开发
4. `Type Script`需要编译为`Java Script`，然后交给浏览器或者其他`Java Script`运行环境执行

---

## 为何需要`Type Script`
#### `Java Script`的缺点
1. `Java Script`随着时间的推移，可以全栈编程`前端、后端、移动端、桌面端`，但是它有下方的问题
2. 不清不楚的数据类型
3. 有漏洞的逻辑
4. 访问不存在的属性
5. 低级的拼写错误

#### `Type Script`的优点
1. 静态类型检查：代码运行之前，发现代码的错误和不合理之处，减少运行时异常出现的机率
2. 虽然代码量大于`Java Script`，但是更容易维护

---

## 编译`Type Script`
#### 基础
1. `Type Script`需要编译为`Java Script`，然后交给浏览器或者其他`Java Script`运行环境执行

#### 命令行编译
1. 不推荐
2. 流程：创建`ts`文件、全局安装`ts`、使用命令编译`.ts`文件
    1. 全局安装`ts`：`npm i typescript -g`
    2. 使用全局命令`tsc`，转换为`js`文件：`tsc xxx.ts`

#### 自动化编译
1. 全局安装`ts`后边，输入命令`tsc --init`，会自动生成一个`tsconfig.json`文件，里面放着各种配置项
2. 命令`tsc --watch index.ts`：监视`ndex.ts`，只要发生改变，就转换成`js`
    1. 监视工程下的所有`ts`文件：`tsc --watch`
3. `noEmitOnError`配置项：当`ts`有错误时，不自动转换为`js`文件
4. `use strict`：严格模式

#### 注意
1. 在`vue`项目中会自动编译

---

## 类型声明
#### 基础
1. 基本类型声明必须使用小写的，大小写代表不同意思
    1. `let x :number`
    2. 注意：只有`number string boolean`是必须小写的，对象类型数据没有这个讲究
2. 常见的类型：
    1. ` :number`：规定为数值
    2. ` :string`：规定为字符串
    3. ` :boolean`：规定为布尔值
    4. ` :any`：任意类型

#### 进行类型声明
###### 限制基础数据类型
1. 直接在后面添加` :数据类型`
    1. 注意：这三个数据类型必须小写
    2. `let a: string`、`let b: number`、`let c: boolean`

###### 限制函数的参数
1. 直接在参数后面添加 :数据类型(必须小写)
2. 传入的参数个数也会被限制

###### 限制函数的返回值
1. 直接在函数体(就是小括号)后添加 :数据类型(必须小写)，但是该函数必须要有返回值

###### 限制字面量类型
1. 使用字面量作为类型，使用场景不多
2. `let a :'hello'`：这样就只能`a='hello'`，否则会报错；`log(a)  ==> hello`

#### 代码
```javascript
1.  限制数据类型
// 直接在后面添加 :数据类型(必须小写)
let a: string
let b: number
let c: boolean

--------------------------------------------------------------------

2. 限制函数的参数
// 直接在参数后面添加 :数据类型(必须小写)
function addSum(sum: number) {
    // 报错：sum规定为数值，不能把sum赋值为字符串
    return sum = '1'
}

// 报错：规定参数必须是数值类型
addSum('1')
// 报错：规定只能传入一个参数
addSum(1,2)

--------------------------------------------------------------------
  
3. 限制函数的返回值
// 直接在函数体(就是小括号)后添加 :数据类型(必须小写)，但是该函数必须要有返回值
function bigSum(sum: any): number {
    // 报错：不能把返回值赋值为字符串
    return sum + '1'
}

--------------------------------------------------------------------

```

---

## 类型推断
#### 基础
1. `ts`会根据变量的值，去推断该变量的数据类型
2. 不推荐主动使用类型推断，还是要自己手动定义数据类型

#### 代码
```javascript
1. ts会自动进行类型推断
let b = 99
b = 'hello'  ==> 报错，不能把字符串赋值给数据类型的变量
```

---

## 类型总览
#### `js`和`ts`的数据类型
###### `js`中的类型数据
1. 就是`js`的数据类型
    1. 基本数据类型：`string number boolean null undefined bigint symbol`
    2. 引用数据类型：`object，包含 Array Function Date Error`

###### `ts`中的数据类型
1. 拥有上述所有的`js`数据类型
2. 六个新类型：

| **关键字** | **语义** | **使用方式** |
| :---: | :---: | :---: |
| any | 任意类型数据 | `: any`，把`any`类型的数据赋值给其他变量，会改变其他变量的数据类型 |
| unknown | 未知的类型，不会改变数据类型的`any` | `: unknown`，赋值给其他变量需要先对数据类型进行判断或者断言 |
| never | 任何值都不是 | 一般用来限制永远不会正常执行完成的函数的返回类型，函数里大多会抛出错误或者中断 |
| void | 函数返回空 | `: void`，`js`的函数默认会返回`undefined`，可以拿来使用；但限制了`void`的函数返回值，虽然也是`undefined`，但是不能拿来使用 |
| object | 对象格式，不常使用，太广泛了 | `: object`，小写的用来限制非基础类型数据；大写的用来限制除`null、undefined`之外的数据 |
| tuple | 是一种写法，用来精细规定数组里每一个数据的类型 | `let array :[string,number]` |
| enum | 枚举，定义一组命名常量 | `enum NameList{ }` |


3. 两个用于自定义类型的方式

| **关键字** | **语义** | **使用方式** |
| :---: | :---: | :---: |
| type |  |  |
| interface | 接口 |  |


#### 注意
1. 之所以推荐限制数据类型时小写`:number`，是因为大写的可以赋值为构造函数的实例化对象，而在`js`中内置的构造函数很少使用这些构造函数，且构造函数占内存。`ts`中同理，所以推荐使用小写的 

---

## 常用类型精讲
#### `any`
###### 基础
1. 语义：任意类型的数据，一旦使用`any`类型，相当于放弃了`ts`的类型检查，`ts`也不会进行推断
    1. 显示：`let a :any`
    2. 隐式：`let a`
    3. `ts`都不会进行推断
2. 注意：`any`类型的变量，可以赋值给任意类型的变量，且会改变它的数据类型

###### 代码
```javascript
1. 通过赋值any类型的数据，改变原有的数据类型

let a: any
let b: string

a = 0
b = a

console.log(b); ==> 0
console.log(typeof b);  ==> number
```

---

#### `unknown`
###### 基础
1. 语义：未知类型的数据，`let a :unknown`
    1. 可以理解为：不会改变数据类型的`any`
2. `unknown`类型数据不能直接赋值给其他变量，需要先对数据类型进行处理，有两种手段：
    1. 第一种：先进行数据类型的判断
    2. 第二种：断言：`as 小写数据类型`，添加在需要断言的代码后面
        1. 另一种写法：`<小写的数据类型>`，添加在需要断言的代码前面

###### 代码
```javascript
1. unknown不会破坏原有的数据类型

let a: unknown
let b: string

b = a  ==> 报错，不能直接把unknown类型的数据赋值给string类型的数据

----------------------------------------------------------------------------

2. 数据类型判断后赋值
let a: unknown
let b: string

a = 'hello'

if (typeof a === 'string') {
    b = a
}

----------------------------------------------------------------------------

3. 使用断言的方式
let a: unknown
let b: string

b = a as string
// 断言写法二
b = <string>a
```

---

#### `never`
###### 基础
1. 语义：任何值都不是，不能被赋值，常用来限制函数的返回类型
    1. 注意：`js`中，没有设置返回值，会自动返回一个`undefined`
2. 当函数不会正常执行结束时，用` :never`进行限制，比如抛出异常
    1. `throw new Error('程序运行异常！')`
3. `never`一般是`ts`自动推断出来的

---

#### `void`
###### 基础
1. 语义：空，表示该函数只能返回`undefined`，调用者也不应该依赖其返回值进行任何操作
    1. 也就是说虽然返回的是`undefined`，但是这个`undefined`也不能拿来使用
    2. `js`本身返回的`undefined`是可以拿来使用的
2. 作用：限制函数返回值
3. 注意：`js`函数默认返回的`undefined`占内存，值为空，可以使用，`:void`返回的`undefined`不占内存，也无法使用

###### 代码
```javascript
1. void返回的undefined不能拿来使用
function add(): void {

}
let a = add()

if (a) {  ==> 报错，无法测试 "void" 类型的表达式的真实性
    
}

---------------------------------------------------------------------------------

2. js默认返回的undefined可以拿来使用
function add() {

}
let a = add()
console.log(a);
if (a) {
    console.log("undefined可以用来进行判断");
} else {
    console.log("undefined可以用来进行判断");
}

```

---

#### `object`
###### 基础
1.  开发中用的少，因为限制的范围太大了，大小写不同的语义不同
    1. `let a :object`：此时`a`可以存储的数据类型有：非基本类型数据
    2. `let a :Object`：此时`a`可以存储的数据类型有：可以调用到`Object`方法的类型，也就是除了`null 、undefined`，其他都能存

---

#### 声明对象类型数据
###### 通过字面量的方式声明：
1. 方式：`let person :{ name:'wxm' }`
    1. `name:'wxm' :string`：该对象必须要有这个`key:value`，且`value`必须是字符串类型，声明几个就只能赋值几个
    2. `name?:'wxm' :string`：添加`?`，则表示非必须，但`value`依然必须是字符串类型，声明几个就只能赋值几个
    3. `[name:string]:any`：索引签名，表示可以有若干个属性，只要满足`key`是字符串，有任意类型的`value`就行，可以赋值若干个

###### 声明数组类型数据
1. 写法一：`let arr:string[]`，声明一个数组，里面的值都是字符串类型
2. 写法二：`let arr:Array<number>`，声明一个数组，里面的值都是数值类型
3. 写法三：`tuple`写法`let arr:[string,string]`，精细规定每一个值

###### 声明函数
1. 限制参数和返回值的类型，`:(参数:参数的数据类型)=>函数返回值的数据类型`
2. 使用方法：在`()`里限制参数的数据类型，在`=>`后面限制返回值的数据类型
3. 声明了几个参数，就只能传入几个参数

###### 代码
```javascript
1. 通过字面量声明对象类型数据
let obj: { name: string, age?: number, [key: string]: any }
obj = { name: '王小明', age: 18, school: '清华' }

-------------------------------------------------------------------

2. 声明函数类型
let fun :(a:number,b:number) =>number
fun = function(a,b){
  return a+b
}

fun(1,2) ==> 1+2=3
fun(1,2,3)  ==>报错，应有 2 个参数，但获得 3 个

-------------------------------------------------------------------

3. 声明数组类型
let arr1:string[]
// Array<number>：泛型写法
let arr2:Array<number>
// tuple写法
let arr3:[string,string]
```

---

#### `tuple`
###### 基础
1. 语义：元组，是一种特殊的数据类型，可以存储固定数量的元素，并且每个元素的类型是已知的且可以不同，元组用于精准描述一组值的类型。`?`表示可选元素，必选元素不能位于可选元素后。`...string[]`表示可以有无限多个`string`类型数据
2. 用法：`let array: [string, string, number, number?,...string[]]`
3. 注意：`tuple`不是关键字，是一种写法，所以不能直接`let array :tuple`

###### 代码
```javascript
let array: [string, string, number, number?,...string[]]
```

---

#### `enum`
###### 基础
1. 语义：枚举，可以定义一组命名常量，能增强代码得可读性，让代码更好维护。是一个特殊的对象
2. 使用方法：`enum NameList {  }`、`function name(name:NameList){  NameList.xxx  }`
3. 注意：建议枚举的名称首字母大写，定义的常量无法修改

###### 字符串枚举
1. 就是在定义的适合，通过`=`定义，类似于定义别名，没有了反向映射
    1. 反向映射：就是有`key:value`的同时，还有`value:key`

###### 常量枚举
1. 就是枚举里定义了很多，但是只用到了一个，会造成性能浪费，通过`const`关键字，减少性能浪费
2. 用法是在`enum`前加一个`const`关键字

###### 代码
```javascript
1. 通过枚举提高代码可维护性
enum NameList { Up, Down, Left, Right }

function walk(data: NameList) {
    if (data === NameList.Up) {
        console.log(NameList[data]);
    }
}

walk(NameList.Up)

NameList.Up = 99  ==> 报错，因为常量无法修改

------------------------------------------------------------------------------

2. 字符串枚举
enum NameList { Up='上', Down='下', Left='左', Right='右' }
console.log(NameList);  ==> {Up: '上', Down: '下', Left: '左', Right: '右'}

------------------------------------------------------------------------------

3. 常量枚举
const enum NameList { Up, Down, Left, Right }
walk(NameList.Up)  ==> 在编译时，只会变量NameList.Up属性
```

---

#### `type`
###### 基础
1. 语义：给任意类型的数据配置别名 

###### 联合声明
1. 表示值可以是几种不同的类型，使用`|`做连接，是一种高级类型

###### 交叉类型
1. 允许多个类型合并为一个类型，用`&`做连接

###### 代码
```javascript
1. 联合声明 或
type Prepon = '男' | '女'
let xm: Prepon = '男'  ==>xm只能在男、女之间选择

--------------------------------------------------------------------------------

2. 交叉类型 且
type Area = {
    height: number,
    width: number
}

type Address = {
    num: number,
    cell: number
}

type House = Area & Address

const hosue:House = {  ==>此时的hosue必须都满足Area和Address
    height: 100,
    width: 100,
    num: 101,
    cell: 3
}

注意：不能直接用基本类型的，因为无法找到这样的值
type Demo  = number & string
let x:Demo = xxxx  ==> 无法找到这样的值，即是字符串又是数值
```

---

#### `void`：一个特殊情况
###### 基础
1. 使用类型声明限制函数返回值为`void`时，`ts`并不会严格要求函数返回空

###### 代码
```javascript
1. 创建函数时，就声明返回值为void，该函数的返回值就是空
function addSum(params: number): void {
    return 99  ==> 不能将类型“number”分配给类型“void”
}

---------------------------------------------------------------------------------

2. 先定义类型，然后在用来限制函数，ts就不会严格要求返回为空

type FunInter = () => void
let fun1: FunInter = function () {
    return 99  ==> 此时就不会报错
}
```

---

## 自定义类型
暂存

---

## 抽象类
暂存

---

## `interface`接口
#### 基础
1. 作用：是一种定义结构的方式，主要作用是为：类、对象、函数规定一种契约，这样就能确保代码的一致性和类型安全
2. 注意：只能定义格式，不能包含任何实现
3. 推荐：推荐命名方法是`PersonInterFace`

#### 使用场景
1. 定义对象格式，无脑冲接口

#### 定义类结构
需要类的基本知识，后续用上再补

#### 定义对象结构
1. `readonly`：设置属性为只读，不可修改
2. `?`：设置为可选属性

#### 定义函数结构
1. 用起来简单，定义函数的参数和返回值
    1. `(key1:数据类型,key2:数据类型):返回值的数据类型`

#### 接口之间的继承
1. 和继承类的概念相似，通过`extends`关键字进行继承
    1. `interface 接口名称 extends 继承的接口 {  } `

#### 接口自动合并（可重复定义）
1. 基础：就是同一个接口名称是可以重复定义的，定义两次，则两次规定的内容都生效

#### 代码
```javascript
1. 使用interFace定义类结构
interface PersonInterFace {
    name: string
}

class Person implements PersonInterFace {
    constructor(public name: string) { }
}

-----------------------------------------------------------------------------------
  
2. 使用interFace定义对象类型数据
interface PersonInterFace {
  name: string,
  // readonly：只读属性
  readonly gender: string,
  // ?：可选属性
  age?: number
}

let obj: PersonInterFace = {
    name: '王小明',
    gender: '男'
}

-----------------------------------------------------------------------------------

3. 使用接口定义函数
interface PersonInterFace {
    (a: number, b: number): number
}

let fun: PersonInterFace = (x, y) => {
    return x + y
}

-----------------------------------------------------------------------------------

4. 接口的继承
interface PersonInterFace {
    name: string,
    age: number
}

interface PersonInterFaceTwo extends PersonInterFace {
    name2: string,
    age2: number
}

let obj: PersonInterFaceTwo = {
    name: '王小明',
    age: 18,
    name2: '王小明',
    age2: 18
}

-----------------------------------------------------------------------------------

5. 接口的自动合并
interface PersonInterFace {
    name: string,
    age: number
}

interface PersonInterFace {
    name2: string,
    age2: number
}

let obj: PersonInterFace = {
    name: '王小明',
    age: 18,
    name2: '王小明',
    age2: 18
}
```

---

## 相似概念
#### `type`和`interface`的区别
###### 基础
1. 相同点：都可以定义对象结构，在很多场景可以相互替换
2. 不同点：
    1. `interface`：专注于定义对象和类的结构，支持继承、合并
    2. `type`：可以定义类型别名，联合类型`|`，交叉类型`&`，但不支持继承、合并

###### 代码
```javascript
1. type和interface的相同点
interface PersonInterFace {
    name: string,
    age: number
}
type PersonType = {
    name: string,
    age: number,
    speak(): void
}

// 用type和interface限制对象和定义数据
let obj1: PersonInterFace = {
    name: 'wxm',
    age: 18
}
let obj2: PersonType = {
    name: 'wxm',
    age: 18,
    speak() {
        console.log('程序执行了');
    },
}

-----------------------------------------------------------------------------------

2. type和interface的区别
// 使用type实现 合并
type PersonType = {
    name: string,
    age: number
} & {
    speak: () => void
}
// 使用type实现 继承
type PersonTypeTwo = PersonType & {
    grade: string
}
```

---

## 泛型
#### 基础
1. 概念：泛型允许我们在定义函数、类或接口时，使用类型参数表示未指定的类型，这些参数在具体使用时，才会被指定具体的类型
2. 作用：让同一段代码适用于多种类型，同时任然保证安全性
3. 使用：一般使用`T`代指泛型，代表改类型不确定，根据调用者确定是什么类型
    1. `interface`中可以使用泛型
    2. 也可以把`type`当作泛型使用

#### 代码
```javascript
1. 泛型的简单应用
function logData<T>(data: T) {
    console.log(data);
}

logData<Number>(1)
logData<boolean>(true)
logData<string>('王小明')

-----------------------------------------------------------------------------------

2. 可以定义多个泛型
function logData<T, U>(data: T, data2?: U) {
    console.log(data);
}

logData<Number, string>(1)
logData<boolean, string>(true)
logData<string, string>('王小明')

-----------------------------------------------------------------------------------

3. 泛型接口
// 接口中有泛型
interface SumInter<T> {
    name: string,
    age: T
}

// 在使用接口时，需要指定泛型数据
let sum: SumInter<number> = {
    name: '王小明',
    age: 18
}

-----------------------------------------------------------------------------------

4， 把type当作接口的泛型使用
interface PersonInter<T> {
    speak: () => void,
    preson: T
}

type PresonType = {
    name: string,
    age: number
}

let obj: PersonInter<PresonType> = {
    speak() {

    },
    preson: {
        name: 'wxm',
        age: 18,
    },
}

```

---

