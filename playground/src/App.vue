<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-09 17:18:00
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-11 15:32:42
 * @FilePath: \my-component-library\src\App.vue
 * @Description: 添加缓存组件的配置
-->
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
