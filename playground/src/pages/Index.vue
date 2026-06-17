<!--
 * @Author: 李玉辉
 * @Date: 2026-05-09 17:16:15
 * @LastEditTime: 2026-06-16 17:00:00
 * @LastEditors: 李玉辉
 * @Description: 首页 - 路由导航
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const routes = router.getRoutes().filter(
  (route) => !route.path.includes(':pathMatch')
)
</script>

<template>
  <div class="index">
    <header class="index__header">
      <h1 class="index__title">组件库 Playground</h1>
      <p class="index__subtitle">已注册的页面路由，点击即可跳转</p>
    </header>

    <div class="index__list">
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="route.path"
        class="index__item"
      >
        <span class="index__item-name">{{ route.name?.toString() || 'home' }}</span>
        <span class="index__item-path">{{ route.path }}</span>
        <span class="index__item-arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.index {
  max-width: 640px;
  margin: 0 auto;
  padding: 64px 24px;
}

.index__header {
  margin-bottom: 40px;
}

.index__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #171717;
  margin: 0 0 8px;
}

.index__subtitle {
  font-size: 0.875rem;
  color: #737373;
  margin: 0;
}

.index__list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.index__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #fff;
  text-decoration: none;
  transition: background 0.15s;
}

.index__item:hover {
  background: #f5f5f5;
}

.index__item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #171717;
  min-width: 100px;
}

.index__item-path {
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.8125rem;
  color: #737373;
  flex: 1;
}

.index__item-arrow {
  color: #a3a3a3;
  font-size: 0.875rem;
  transition: color 0.15s, transform 0.15s;
}

.index__item:hover .index__item-arrow {
  color: #2563EB;
  transform: translateX(2px);
}
</style>
