/*
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-11 10:25:53
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-11 15:16:20
 * @FilePath: \my-component-library\src\hooks\useCacheManager.ts
 * @Description: 组件缓存hooks，让组件通过路由跳转后，返回是数据得到保存。提供自动缓存当前组件的方法
 */
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

// 检查组件是否以缓存
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
