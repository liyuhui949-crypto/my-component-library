---
title: 全局缓存管理
---

# 全局缓存管理模块

基于 Vue 3 + TypeScript + mitt 实现的 keep-alive 缓存管理方案。

## 功能特性

- 集中式缓存管理，全局唯一数据源
- 完整的 TypeScript 类型支持
- 自动注册/注销组件缓存
- 灵活的 API 设计
- 支持延迟注册

## 快速开始

### 1. 在 App.vue 中初始化

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useCacheManager } from "./hooks/useCacheManager";
const { cachedComponent, initEventBus, destroyEventBus } = useCacheManager();

// keep-alive :include属性期望得到一个可变的数组，因此需要手动转化为可变的
const includeList = computed(() => [...cachedComponent.value]);

onMounted(() => {
  initEventBus();
});

onUnmounted(() => {
  destroyEventBus();
});
</script>

<template>
  <!-- 根据浏览器报错信息调整为这种格式 -->
  <router-view v-slot="{ Component }">
    <keep-alive :include="includeList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

### 2. 在组件中使用

```vue
<script setup lang="ts">
import { autoRegisterCache } from '@/hooks/useCacheManager';

// 明确指定组件名称（推荐）
defineOptions({
  name: 'UserList'
});

// 一行代码完成缓存注册
// 手动传入name则必须和改文件名称保持一致，否则和vue setup 语法糖自动生成的name不一致会导致缓存失效；可以手动配置 definedOptions({name:"xxxx"}) 实现自定义name，或不传入参数，让代码自动根据文件名称获取name
autoRegisterCache();
</script>
```

## API 说明

### `useCacheManager()`

用于 App.vue 初始化，返回以下属性：

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `cachedComponents` | `Ref<string[]>` | 当前缓存的组件列表 |
| `initEventBus` | `() => void` | 初始化事件总线 |
| `destroyEventBus` | `() => void` | 销毁事件总线 |
| `clearCache` | `() => void` | 清空所有缓存 |

### `autoRegisterCache(options)`

自动注册组件缓存，参数说明：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | 自动获取 | 组件名称，不传则自动从组件实例获取 |
| `autoUnregister` | `boolean` | `true` | 是否在组件卸载时自动注销 |
| `delay` | `number` | `0` | 延迟注册时间（毫秒） |

### 事件总线

通过 `eventBus` 可以手动控制缓存：

```typescript
import { eventBus, CACHE_EVENTS } from '@/utils/eventBus';

// 添加缓存
eventBus.emit(CACHE_EVENTS.ADD, 'UserList');

// 移除缓存
eventBus.emit(CACHE_EVENTS.REMOVE, 'UserList');

// 清空所有缓存
eventBus.emit(CACHE_EVENTS.CLEAR);
```

## 使用示例

### 示例 1：基础用法 — 列表页缓存

典型的列表页场景：进入详情页后返回，列表页数据保留。

```vue [pages/UserList.vue]
<script setup lang="ts">
import { ref, onActivated } from 'vue';
import { autoRegisterCache } from '@/hooks/useCacheManager';

defineOptions({ name: 'UserList' });

// 一行代码启用缓存
autoRegisterCache();

const tableData = ref([]);
const loading = ref(false);

// onActivated 在从缓存恢复时触发，可用于刷新数据
onActivated(() => {
  console.log('UserList 恢复，可选择是否刷新');
});
</script>

<template>
  <div v-loading="loading">
    <el-table :data="tableData">
      <el-column prop="name" label="姓名" />
      <el-column prop="age" label="年龄" />
    </el-table>
  </div>
</template>
```

### 示例 2：手动控制缓存

在某些场景下需要手动添加/移除缓存，例如 Tab 页签管理。

```vue [views/TabManager.vue]
<script setup lang="ts">
import { eventBus, CACH_EVENTS } from '@/utils/eventBus';
import { useCacheManager } from '@/hooks/useCacheManager';

const { getCacheList, clearCache } = useCacheManager();

// 手动添加某个页面到缓存
function keepAlive(name: string) {
  eventBus.emit(CACHE_EVENTS.ADD, name);
}

// 手动移除某个页面的缓存
function removeAlive(name: string) {
  eventBus.emit(CACHE_EVENTS.REMOVE, name);
}

// 清空所有缓存（例如退出登录时）
function handleLogout() {
  clearCache();
}
</script>
```

### 示例 3：延迟注册

对于需要异步加载数据后再启用缓存的场景，使用 `delay` 参数。

```vue [pages/HeavyPage.vue]
<script setup lang="ts">
import { autoRegisterCache } from '@/hooks/useCacheManager';

defineOptions({ name: 'HeavyPage' });

// 延迟 500ms 注册，避免首屏渲染时的竞态问题
autoRegisterCache({ delay: 500 });
</script>
```

### 示例 4：不自动注销

某些场景下希望组件卸载后仍保留缓存（如弹窗内的组件）。

```vue [components/DialogContent.vue]
<script setup lang="ts">
import { autoRegisterCache } from '@/hooks/useCacheManager';

defineOptions({ name: 'DialogContent' });

// autoUnregister: false 表示组件卸载时不自动注销缓存
autoRegisterCache({ autoUnregister: false });
</script>
```

## 注意事项

### 1. 组件名称必须唯一

```vue
<script setup>
import { autoRegisterCache } from '@/hooks/useCacheManager';

// 使用 defineOptions 明确指定名称
defineOptions({
  name: 'UserList'  // 确保在整个应用中唯一
});

autoRegisterCache();
</script>
```

### 2. autoRegisterCache 方法不传 name 更安全

`autoRegisterCache()` 会自动获取组件的 name，无需手动传入：

```vue
<script setup>
//  推荐：自动获取
defineOptions({ name: 'UserList' });
autoRegisterCache();

//  不推荐：手动传入（容易出错）
autoRegisterCache({ name: 'UserList' });
</script>
```

### 3. 缓存组件的生命周期

组件被缓存后：
- 会触发 `onActivated` / `onDeactivated`
- 不会重复触发 `onMounted` / `onUnmounted`

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  console.log('组件被激活');
});

onDeactivated(() => {
  console.log('组件被失活');
});
</script>
```

## 文件结构

```
playground/src/
├── utils/
│   └── eventBus.ts              # 事件总线
├── hooks/
│   └── useCacheManager.ts       # 缓存管理器
└── App.vue                       # 根组件
```

## 源码

::: code-group

```ts [utils/eventBus.ts]
import mitt, { type Emitter } from "mitt";

// ================ 定义事件名称常量，有效避免拼写错误 ================

// 缓存组件相关可选事件：Emitter<Events>指定了泛型，需要添加 as const 断言为常量 —— 不添加断言则类型被推断为string，不满足 Events 的定义
export const CACH_EVENTS = {
  ADD: "addCacheComponent",
  REMOVE: "removeCacheComponent",
  CLEAR: "clearCache",
} as const;

// ================ 定义事件类型映射 ================

// 在 mitt 中，type 定义的不是返回类型，而是参数类型：addCacheComponent: string —— 解读为接收 addCacheComponent 事件，该事件的参数类型是 string
export type Events = {
  // 缓存组件相关事件
  addCacheComponent: string;
  removeCacheComponent: string;
  clearCache: void;
};

// 单例模式，仅提供一个注册事件的入口，确保全局唯一事件总线
export const eventBus: Emitter<Events> = mitt<Events>();
```

```ts [hooks/useCacheManager.ts]
import { eventBus, CACH_EVENTS } from "@/utils/eventBus";
import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
} from "vue";

interface AutoRegisterCache {
  name?: string;
  autoUnregister?: boolean; // 是否自动注销，默认为true
  delay?: number;
}

// 已缓存组件
const cachedComponent = ref<string[]>([]);

// 添加缓存方法
const addToCache = (componentName: string): void => {
  if (!componentName) return;
  if (cachedComponent.value.includes(componentName)) return;
  cachedComponent.value.push(componentName);
};

// 移除缓存方法
const removeFromCache = (componentName: string): void => {
  if (!componentName) return;
  const index = cachedComponent.value.indexOf(componentName);
  if (index > -1) {
    cachedComponent.value.splice(index, 1);
  }
};

// 清空所有缓存方法
const clearCache = (): void => {
  cachedComponent.value = [];
};

// 检查组件是否已缓存
const isCached = (componentName: string): boolean => {
  return cachedComponent.value.includes(componentName);
};

// 获取缓存组件列表
const getCacheList = (): string[] => {
  return [...cachedComponent.value];
};

// 初始化事件监听
const initEventBus = (): void => {
  eventBus.on(CACH_EVENTS.ADD, addToCache);
  eventBus.on(CACH_EVENTS.REMOVE, removeFromCache);
  eventBus.on(CACH_EVENTS.CLEAR, clearCache);
};

// 销毁事件监听
const destroyEventBus = (): void => {
  eventBus.off(CACH_EVENTS.ADD, addToCache);
  eventBus.off(CACH_EVENTS.REMOVE, removeFromCache);
  eventBus.off(CACH_EVENTS.CLEAR, clearCache);
};

// 为当前组件自动添加缓存方法
export const autoRegisterCache = (options: AutoRegisterCache = {}): void => {
  const { name = "", autoUnregister = true, delay = 0 } = options;
  const instance = getCurrentInstance();
  const componentName = name || instance?.type.name || instance?.type.__name;

  if (!componentName) return;

  // 是否已注册
  let isRegistered = false;

  const register = (): void => {
    if (!isRegistered) {
      addToCache(componentName);
      isRegistered = false;
    }
  };

  const unregister = (): void => {
    if (isRegistered) {
      removeFromCache(componentName);
    }
  };

  if (delay > 0) {
    onMounted(() => {
      setTimeout(() => register(), delay);
    });
  } else {
    onMounted(() => {
      register();
    });
  }

  if (autoUnregister) {
    onBeforeUnmount(unregister);
  }
};

export function useCacheManager() {
  return {
    cachedComponent: readonly(cachedComponent), // 只读，防止被修改
    addToCache,
    removeFromCache,
    clearCache,
    isCached,
    getCacheList,
    initEventBus,
    destroyEventBus,
    autoRegisterCache,
  };
}
```

:::
