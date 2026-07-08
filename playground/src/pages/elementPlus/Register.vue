<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-07-07
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-07-07
 * @FilePath: \my-component-library\playground\src\pages\elementPlus\Register.vue
 * @Description: 注册组件演示页面
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Register from '@/components/Register/Index.vue'
import type { RegisterFormData } from '@/components/Register/Index.vue'
import { autoRegisterCache } from '@/hooks/useCacheManager'

autoRegisterCache()

const registerRef = ref()

/** 发送验证码 */
const handleSendCode = async (phone: string) => {
  console.log('发送验证码:', phone)
  // TODO: 调用发送短信验证码接口
  await delay(1000)
  ElMessage.success('验证码已发送')
  registerRef.value?.markCodeSent()
}

/** 验证验证码 */
const handleVerifyCode = async (phone: string, code: string) => {
  console.log('验证验证码:', { phone, code })
  // TODO: 调用验证验证码接口
  await delay(1000)
  ElMessage.success('验证码验证通过')
  registerRef.value?.markCodeVerified()
}

/** 提交注册 */
const handleSubmit = async (data: RegisterFormData) => {
  console.log('注册数据:', data)
  // TODO: 调用注册接口
  await delay(1500)
  ElMessage.success('注册成功')
  registerRef.value?.goToSuccessStep(data.password)
}

/** 去登录 */
const handleLogin = () => {
  ElMessage.info('跳转到登录页')
}

/** 工具函数 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<template>
  <div class="demo-page">
    <Register
      ref="registerRef"
      title="用户注册"
      :show-email="true"
      :show-address="true"
      :enable-captcha="true"
      @send-code="handleSendCode"
      @verify-code="handleVerifyCode"
      @submit="handleSubmit"
      @login="handleLogin"
    >
      <template #footer>
        <div class="demo-footer">
          <span>已有账号？</span>
          <el-link type="primary" :underline="false">去登录</el-link>
        </div>
      </template>
    </Register>
  </div>
</template>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.demo-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
  font-size: 14px;
  color: #525252;

  .el-link {
    margin-left: 4px;
  }
}
</style>
