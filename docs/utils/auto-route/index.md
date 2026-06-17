---
title: 自动注册路由
---

# 自动注册路由方法

基于文件系统自动生成 Vue Router 路由配置，参考 Nuxt 的路由约定。

## 源码

```ts [playground/src/utils/autoRoute.ts]
import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

/**
 * 自动生成路由配置
 */
export const generateAutoRoutes = (
  redirectNotFoundTo: string = "/404",
): RouteRecordRaw[] => {
  const pages = import.meta.glob("../pages/**/*.vue");
  const routes: RouteRecordRaw[] = [];

  for (const path in pages) {
    // 1. 提取相对路径
    // ../pages/User/[id].vue -> /User/[id]
    let relPath = path.replace("../pages", "").replace(/\.vue$/, "");

    // 2. 处理 index 结尾 (支持 User/Index.vue -> /User)
    const isIndex = relPath.toLowerCase().endsWith("/index");
    if (isIndex) {
      relPath = relPath.substring(0, relPath.length - 6);
    }

    // 3. 处理动态参数 (将 [id] 转换为 :id)
    const routePath = relPath.replace(/\[(\w+)\]/g, ":$1") || "/";

    // 4. 生成唯一的 Name (将 /User/:id 转换为 User-id)
    const routeName =
      relPath.split("/").filter(Boolean).join("-").toLowerCase() || "home";

    routes.push({
      path: routePath,
      name: routeName,
      component: pages[path] as Component,
      props: true,
    });
  }

  // 最后添加通配符路由
  if (redirectNotFoundTo) {
    routes.push({
      path: "/:pathMatch(.*)*",
      redirect: redirectNotFoundTo,
    });
  }

  return routes;
};
```

## 使用方式

在 `router/index.ts` 中调用：

```ts [playground/src/router/index.ts]
import { createRouter, createWebHistory } from "vue-router";
import { generateAutoRoutes } from "@/utils/autoRoute";

const router = createRouter({
  history: createWebHistory(),
  routes: generateAutoRoutes(),
});
export default router;
```

## 文件命名与目录规范

通过在 `src/pages` 目录下创建 `.vue` 文件，系统会自动将其注册为路由。

### 1. 基础映射规则

文件的相对路径直接决定了访问的 URL 路径。

| 文件路径 | 生成的路由路径 (Path) | 备注 |
| :--- | :--- | :--- |
| `pages/about.vue` | `/about` | 基础页面 |
| `pages/user/profile.vue` | `/user/profile` | 多级目录 |
| `pages/order-list.vue` | `/order-list` | 建议使用连字符 |

### 2. 根页面与索引 (Index)

`index.vue` 被视为当前目录的默认入口。

| 文件路径 | 生成的路由路径 (Path) | 备注 |
| :--- | :--- | :--- |
| `pages/index.vue` | `/` | 整个应用的首页 |
| `pages/dashboard/index.vue` | `/dashboard` | 目录的默认入口 |

### 3. 动态路由参数

使用 **方括号 `[]`** 包裹文件名来定义动态路由参数（参考 Nuxt 规范）。

| 文件路径 | 生成的路由路径 (Path) | 获取参数方式 |
| :--- | :--- | :--- |
| `pages/user/[id].vue` | `/user/:id` | `props: ['id']` |
| `pages/post/[category]/[id].vue` | `/post/:category/:id` | `props: ['category', 'id']` |

### 4. 路由名称 (Name) 生成规范

路由的 `name` 属性由目录层级通过连字符 `-` 连接而成，用于 `router.push({ name: '...' })`。

- `pages/index.vue` → `name: "home"`
- `pages/about.vue` → `name: "about"`
- `pages/user/settings.vue` → `name: "user-settings"`
- `pages/user/[id].vue` → `name: "user-id"`

## 使用示例

### 示例 1：基础页面

创建 `pages/about.vue`，自动注册为 `/about` 路由。

```vue [pages/about.vue]
<script setup lang="ts">
defineOptions({ name: 'About' });
</script>

<template>
  <div class="about-page">
    <h1>关于我们</h1>
    <p>这是一个基础页面示例。</p>
  </div>
</template>
```

### 示例 2：动态路由参数

创建 `pages/user/[id].vue`，自动注册为 `/user/:id` 路由，通过 `props` 接收参数。

```vue [pages/user/[id].vue]
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

defineOptions({ name: 'UserDetail' });

// 所有自动生成的路由已开启 props: true，直接用 defineProps 接收
const props = defineProps<{ id: string }>();

const userInfo = ref(null);

async function fetchUser(id: string) {
  // 模拟请求
  userInfo.value = { id, name: `用户 ${id}` };
}

// 首次加载
onMounted(() => fetchUser(props.id));

// 参数变化时重新加载（同一组件复用时触发）
watch(() => props.id, (newId) => fetchUser(newId));
</script>

<template>
  <div class="user-detail">
    <h1>用户详情</h1>
    <pre>{{ userInfo }}</pre>
    <router-link to="/user">返回列表</router-link>
  </div>
</template>
```

### 示例 3：多级动态路由

创建 `pages/post/[category]/[id].vue`，自动生成 `/post/:category/:id`。

```vue [pages/post/[category]/[id].vue]
<script setup lang="ts">
defineOptions({ name: 'PostDetail' });

const props = defineProps<{
  category: string;
  id: string;
}>();
</script>

<template>
  <div>
    <nav>
      <router-link to="/post">文章列表</router-link>
      <span> / {{ category }}</span>
    </nav>
    <h1>文章 #{{ id }}（分类：{{ category }}）</h1>
  </div>
</template>
```

### 示例 4：404 页面

创建 `pages/404.vue`，配合 `generateAutoRoutes` 的默认重定向配置使用。

```vue [pages/404.vue]
<script setup lang="ts">
defineOptions({ name: 'NotFound' });
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
```

> 未匹配的路径会自动重定向到 `/404`，可通过 `generateAutoRoutes('/other-redirect')` 自定义。

## 约束与最佳实践

### 禁止行为

- **禁止重名**：不要创建同名但结构不同的文件。例如同时存在 `pages/user.vue` 和 `pages/user/index.vue`，这会导致路由冲突。
- **禁止特殊字符**：文件名除 `[]` 和 `-` 外，不得包含空格、中文字符或特殊符号。

### 最佳实践

- **启用 Props 接收**：所有自动生成的路由均已开启 `props: true`。在组件内建议直接使用 `defineProps(['id'])` 接收参数，而不是通过 `route.params`，以提高组件的可测试性。
- **私有组件隔离**：如果某个组件仅作为子组件使用，而不希望生成路由，请将其放入 `src/components` 目录，或在 `pages` 中创建以下划线开头的文件夹（如 `pages/user/_components/`），本方法会自动忽略。

## 示例结构参考

```text
src/pages/
├── index.vue                # URL: / (name: home)
├── login.vue                # URL: /login (name: login)
├── article/
│   ├── index.vue            # URL: /article (name: article)
│   └── [id].vue             # URL: /article/:id (name: article-id)
└── user/
    ├── center.vue           # URL: /user/center (name: user-center)
    └── settings.vue         # URL: /user/settings (name: user-settings)
```

## 开发提示

1. **热更新**：新增文件后，Vite 会自动重新触发 glob 扫描，无需手动重启。
2. **404 页面**：系统已自动处理通配符，未匹配到的路径将根据配置重定向。
