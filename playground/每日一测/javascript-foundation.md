---
JavaScript 方法
---

<script setup>
import Javascriptfoundation from "@components/Javascriptfoundation.vue"

const map = new Map();
map.set("wxm", "title");
const obj = {
  name: "wxm"
};
const array = Array.from(map);
const array2 = Object.keys(obj);
const array3 = Object.values(obj);
const array4 = Object.entries(obj);
const array5 = Array(12);
const array6 = array5.fill(null);
const array7 = Array.from([1, 2, 3, [4, 5, [6, 7]]]);
const array8 = array7.flat();
const array9 = [1, 12, 121, 142213, 4];
const array10 = array9.sort((a, b) => {
  return a - b;
});
const array11 = array10.reverse();

function log() {
  console.log(map, "@map");
  console.log(array, "@array");
  console.log(array2, "@array2");
  console.log(array3, "@array3");
  console.log(array4, "@array4");
  console.log(array5, "@array5");
  console.log(array6, "@array6");
  console.log(array5 === array6, "@array5 === array6");
  console.log(array7, "@array7");
  console.log(array8, "@array8");
  console.log(array9, "@array9");
  console.log(array10, "@array10");
  console.log(array11, "@array11");
  console.log(array10 === array9, "@array10 === array9,");
}
</script>

# 数组操作方法

## 生成数组

```js
Array(): Array 构造函数, 接受唯一参数且是整数时, 生成一个 length 为改整数的空槽数组, 一般搭配 fill 使用
Array.from(): 接收可迭代的参数, 包括数组 字符串 set 对象实例 map 对象实例;
Array.prototype.flat(): 根据指定深度把嵌套数组全部展开, 默认深度为 1
Array.rpototye.slice(start, end): 方法返回一个新的数组对象，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。原始数组不会被改变
Object.keys(): [ 'key', 'key']
Object.values(): [ 'value', 'value']
Object.entries(): [ ['key','value'], ['key','value']]
```

## 会影响原数组

```js
Array.prototype.shift(): 弹出数组中的第一个值, 并更改数组长度
Array.prototype.splice(start, deleteCount, ...item1): 删除/替换/新增数组中的内容
Array.prototype.fill(value): 使用固定值填充数组, 不会改变 this 指向
    const array5 = Array(12);
    const array6 = array5.fill(null);
    console.log(array5 === array6);  ===> true

Array.prototype.sort(callbackFn): 对数组进行排序, 不会改变 this 指向
    const array9 = [1, 12, 121, 142213, 4];
    const array10 = array9.sort((a, b) => {
    return a - b;
    });
    console.log(array10 === array9, "@array10 === array9,"); ===> true

Array.prototype.reverse(): 反转数组, 也不会改变 this 指向, 可以用于倒序

```

## 确定数组状态或某个值

```js
Array.prototype.every(callbackFn): 返回布尔值, 是否全部通过
Array.prototype.find(callbackFn): 返回第一个满足条件的值
Arrar.prototype.findindex(callbackFn): 返回第一个满足条件值得索引值
Array.prototype.some(callbackFn): 返回布尔值, 是否有一个值满足条件
Array.prototype.includes(searchElement): 返回布尔值, 数组中是否某个值
Array.prototype.indexof(searchElement): 返回第一次出现该值的索引值, 没有则返回 -1
```

## 总结

<Javascriptfoundation>
  <el-button type="primary" @click="log">输出</el-button>
</Javascriptfoundation>

::: details

```js
const map = new Map();
map.set("wxm", "title");
const obj = {
  name: "wxm"
};
const array = Array.from(map);
const array2 = Object.keys(obj);
const array3 = Object.values(obj);
const array4 = Object.entries(obj);
const array5 = Array(12);
const array6 = array5.fill(null);
const array7 = Array.from([1, 2, 3, [4, 5, [6, 7]]]);
const array8 = array7.flat();
const array9 = [1, 12, 121, 142213, 4];
const array10 = array9.sort((a, b) => {
  return a - b;
});
const array11 = array10.reverse();

function log() {
  console.log(map, "@map");
  console.log(array, "@array");
  console.log(array2, "@array2");
  console.log(array3, "@array3");
  console.log(array4, "@array4");
  console.log(array5, "@array5");
  console.log(array6, "@array6");
  console.log(array5 === array6, "@array5 === array6");
  console.log(array7, "@array7");
  console.log(array8, "@array8");
  console.log(array9, "@array9");
  console.log(array10, "@array10");
  console.log(array11, "@array11");
  console.log(array10 === array9, "@array10 === array9,");
}
```

:::

#### 生成新数组

| 属性名           | 说明            | 参数               | 作用                                                         | 类型       |
| :--------------- | :-------------- | :----------------- | :----------------------------------------------------------- | ---------- |
| Array()          | Array()构造函数 | 正整数             | 接收一个正整数,创建 length 为该正整数的空槽数组              | 生成新数组 |
| Array.from()     | 静态方法        | 可迭代的参数       | 将可迭代的参数转化为数组, 包含字符串 数组 set map 实例对象等 | 生成新数组 |
| .flat()          | 实例方法        | 展开嵌套数组的内容 | 展开深度, 默认是1                                            | 生成新数组 |
| .slice()         | 实例方法        | start,end          | 返回从原数组的start到end(不包含end)浅拷贝的新数组            | 生成新数组 |
| Object.keys()    | 静态方法        | object对象         | 返回该对象里所有key组成数组, ['key1','key2']                 | 生成新数组 |
| Object.values()  | 静态方法        | object对象         | 返回该对象里所有value组成的数组,['value1','value2']          | 生成新数组 |
| Object.entries() | 静态方法        | object对象         | `[ ['key','value'], ['key','value'] ]`                       | 生成新数组 |

#### 会影响原数组

| 属性名                   | 说明         | 参数               | 作用                                 | 类型         |
| :----------------------- | :----------- | :----------------- | :----------------------------------- | ------------ |
| Array.prototype.shift()  | 数组实例方法 | 无参数             | 弹出数组的第一项                     | 会影响原数组 |
| Array.prototype.splice() | 数组实例方法 | start,end, ...item | 删除/替换/新增数组内容               | 会影响原数组 |
| Array.prototype.fill()   | 数组实例方法 | value              | 使用固定值填充数组, 不会改变this指向 | 会影响原数组 |
| Array.prototype.sort     | 数组实例方法 | callbackFn         | 对数组排序, 不会改变this指向         | 会影响原数组 |

#### 确定数组状态或某个值

| 属性名                    | 说明         | 参数          | 作用                                 |
| :------------------------ | :----------- | :------------ | :----------------------------------- |
| Array.prototype.every()   | 数组实例方法 | callbackFn    | 返回布尔值, 是否全部通过             |
| Array.prototype.find()    | 数组实例方法 | callbackFn    | 返回第一个满足条件的值               |
| Array.prototype.findindex | 数组实例方法 | callbackFn    | 返回第一个满足条件值的索引           |
| Array.prototype.some      | 数组实例方法 | callbackFn    | 返回布尔值, 是否有至少一个值满足条件 |
| Array.prototype.includes  | 数组实例方法 | searchElement | 返回布尔值, 数组中是否有该值         |
| Array.prototype.indexof   | 数组实例方法 | searchElement | 返回第一次出现该值的索引值           |

# Set 和 Map

## Set

必须使用 `new Set()` 进行实例化, 也就是说只有一种方法生成 Set 实例对象

Set(iterable): 接受可迭代的参数, 将所有元素不重复的添加到 Set 中

Set 实例对象没有很好的循环方法, 所以推荐使用 Array.form() 或 Array(...set) 进行数组化后再循环

实例方法如下:

```js
Set.prototype.add(value)
Set.prototype.delete(value)
Set.prototype.has(value): 返回布尔值, 是否包含该元素
Set.prototype.clear(): 移除所有元素

Set.prototype.size: 实例属性, 类似与 length

```

## Map

必须使用 `new Map()` 进行实例化

Map(): 接受键值对数组 `[ [1,2], [3] ]`

Map.prototype.set(key, value): 添加键值对
Map.prototype.delete(key)
Map.prototype.clear()
Map.prototype.get(key): 返回 map 中的指定元素; 如果该元素是对象类型数据, 则返回它的地址值

::: warning
这就意味者该地址值一致可以访问, 不会被垃圾回收机制清除, 有内存泄漏的风险
:::

## 总结

<Javascriptfoundation>
  <!-- <el-button type="primary" @click="log2">输出</el-button> -->
</Javascriptfoundation>

::: details
h1
:::
