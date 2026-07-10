### vue2 和 vue3 的区别

> 使用层面:
>
> - 在 vue3.0, 推荐使用选项式API, 也就是 setup 函数, 在 vue3.2 更进一步, 推出了 script setup 语法糖
> - 在 vue3, 简化了使用子组件操作, 直接引入使用而无需注册; 生命周期里的 beforeCreate created 被 setup 替代, 其他生命周期名称也有所变化; 模板特性增强, 支持多个根元素
> - 新增 teleport(瞬移) 组件; 深度选择器语法 :deep(.className); vue3.4+ 新增 defineModel 函数, 是自定义事件和 props 的语法糖
> - 打包方面, 用 vite 取代 vue cli
> -

> 源码层面:
>
> 1. 响应式系统重写:
>    - vue2 通过静态方法 Object.defineProperty(), 重写响应式对象的 get() 和 set(); 通过 data 函数返回的基本数据类型的数据, 都会被包装成响应式对象，也就是vue2中数据需要定义在data函数中的原因：需要包装成响应式对象、数据私有化
>    - vue3 通过 Proxy() 构造函数, 创建响应式对象的代理, 也就是 reactive; 如果是基本数据类型, 则通过 ref Api包装一个 .value 属性, 然后代理 .value 属性
>    - 两者的差别:
>      - Object.defineProperty 只能代理已经存在的属性，它是在对象初始化时对每个属性逐个进行代理的, 所以在 vue2 中新增属性需要通过 $set() 的方式重新运行一次代理过程，且无法检测数组索引值变化（作者说数组长度无法确定，强行检测会耗费性能）; Proxy 代理的是整个对象，它拦截的是对对象的所有操作（包括新增、删除、枚举等），而不是某个属性
>      - Proxy 的性能更好
> 2. v-if 和 v-for 的优先级变化; 在 vue3 中, v-if 的优先级比 v-for 的高

nextTick？

组件封装思路？
