<!--
 * @Author: 李玉辉
 * @Date: 2026-06-15 17:15:19
 * @LastEditTime: 2026-06-16 16:45:00
 * @LastEditors: 李玉辉
 * @Description: 404 页面
-->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found__code">404</div>
    <h1 class="not-found__title">页面未找到</h1>
    <p class="not-found__desc">请求的路径 <code>{{ router.currentRoute.value.fullPath }}</code> 不存在</p>
    <div class="not-found__actions">
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      <el-button @click="router.back()">返回上页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
}

.not-found__code {
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  color: #e5e5e5;
  margin-bottom: 1.25rem;
  letter-spacing: 0.1em;
}

.not-found__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #171717;
  margin: 0 0 0.75rem;
}

.not-found__desc {
  color: #737373;
  font-size: 0.9375rem;
  margin: 0 0 2.5rem;
}

.not-found__desc code {
  background: #f5f5f5;
  padding: 0.15em 0.5em;
  border-radius: 4px;
  font-size: 0.85em;
  color: #525252;
}
</style>
