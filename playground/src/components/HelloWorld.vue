<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-05-09 17:00:35
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-05-11 15:36:01
 * @FilePath: \my-component-library\src\components\HelloWorld.vue
 * @Description: 添加跳转到首页后返回当前组件，数据被缓存的示例
-->
<script setup lang="ts">
import { ref } from "vue";
import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
import vueLogo from "../assets/vue.svg";
import { autoRegisterCache } from "@/hooks/useCacheManager";
import router from "@/router";

const count = ref(0);

// 一行代码完成缓存注册
// 手动传入name则必须和改文件名称保持一致，否则和vue setup 语法糖自动生成的name不一致会导致缓存失效；可以手动配置 definedOptions({name:"xxxx"}) 实现自定义name，或不传入参数，让代码自动根据文件名称获取name
autoRegisterCache();
</script>

<template>
  <section id="center">
    <div class="hero">
      <img :src="heroImg" class="base" width="170" height="179" alt="" />
      <img :src="vueLogo" class="framework" alt="Vue logo" />
      <img :src="viteLogo" class="vite" alt="Vite logo" />
    </div>
    <div>
      <h1>Get started</h1>
      <p>Edit <code>src/App.vue</code> and save to test <code>HMR</code></p>
    </div>
    <button type="button" class="counter" @click="count++">
      Count is {{ count }}
    </button>
  </section>

  <div class="ticks"></div>

  <div @click="() => router.push({ name: 'home' })">到首页</div>

  <section id="next-steps">
    <div id="docs">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
      <h2>Documentation</h2>
      <p>Your questions, answered</p>
      <ul>
        <li>
          <a href="https://vite.dev/" target="_blank">
            <img class="logo" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank">
            <img class="button-icon" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div id="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Vite community</p>
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#github-icon"></use>
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a href="https://chat.vite.dev/" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#discord-icon"></use>
            </svg>
            Discord
          </a>
        </li>
        <li>
          <a href="https://x.com/vite_js" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-icon"></use>
            </svg>
            X.com
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/vite.dev" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#bluesky-icon"></use>
            </svg>
            Bluesky
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template>

<style lang="scss" scoped>
@import url("@/style.css");
</style>
