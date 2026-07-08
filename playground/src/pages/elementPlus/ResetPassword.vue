<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-07-07
 * @LastEditors: 李玉辉
 * @LastEditTime: 2026-07-07 11:24:40
 * @FilePath: \my-component-library\playground\src\pages\elementPlus\ResetPassword.vue
 * @Description: 重置密码组件演示页面
-->
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import ResetPassword from "@/components/ResetPassword/Index.vue";
import type {
  VerifyType,
  ResetFormData,
} from "@/components/ResetPassword/Index.vue";
import { autoRegisterCache } from "@/hooks/useCacheManager";

autoRegisterCache();

const emailRef = ref();
const phoneRef = ref();

/** 验证方式切换 */
const verifyType = ref<VerifyType>("email");

/** ========== 邮箱模式 ========== */

/** 发送验证码 */
const handleEmailSendCode = async (account: string) => {
  console.log("[邮箱] 发送验证码:", account);
  // TODO: 调用发送验证码接口
  await delay(1000);
  ElMessage.success("验证码已发送");
  emailRef.value?.goToCodeStep();
};

/** 验证验证码 */
const handleEmailVerifyCode = async (account: string, code: string) => {
  console.log("[邮箱] 验证验证码:", { account, code });
  // TODO: 调用验证验证码接口
  await delay(1000);
  emailRef.value?.goToPasswordStep();
};

/** 提交新密码 */
const handleEmailSubmit = async (data: ResetFormData) => {
  console.log("[邮箱] 提交数据:", data);
  // TODO: 调用重置密码接口
  await delay(1500);
  ElMessage.success("密码重置成功");
  emailRef.value?.goToSuccessStep();
};

/** ========== 手机号模式 ========== */

/** 发送验证码 */
const handlePhoneSendCode = async (account: string) => {
  console.log("[手机] 发送验证码:", account);
  // TODO: 调用发送短信验证码接口
  await delay(1000);
  ElMessage.success("验证码已发送");
  phoneRef.value?.goToCodeStep();
};

/** 验证验证码 */
const handlePhoneVerifyCode = async (account: string, code: string) => {
  console.log("[手机] 验证验证码:", { account, code });
  // TODO: 调用验证验证码接口
  await delay(1000);
  phoneRef.value?.goToPasswordStep();
};

/** 提交新密码 */
const handlePhoneSubmit = async (data: ResetFormData) => {
  console.log("[手机] 提交数据:", data);
  // TODO: 调用重置密码接口
  await delay(1500);
  ElMessage.success("密码重置成功");
  phoneRef.value?.goToSuccessStep();
};

/** 完成 */
const handleComplete = () => {
  ElMessage.info("跳转到登录页");
};

/** 工具函数 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
</script>

<template>
  <div class="demo-page">
    <!-- 切换验证方式 -->
    <div class="demo-switch">
      <el-radio-group v-model="verifyType">
        <el-radio-button value="email">邮箱验证</el-radio-button>
        <el-radio-button value="phone">手机号验证</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 邮箱模式 -->
    <ResetPassword
      v-if="verifyType === 'email'"
      ref="emailRef"
      verify-type="email"
      title="重置密码"
      @send-code="handleEmailSendCode"
      @verify-code="handleEmailVerifyCode"
      @submit="handleEmailSubmit"
      @complete="handleComplete"
    >
      <template #footer>
        <div class="demo-footer">
          <el-link underline="hover" :href="`/`">返回首页</el-link>
        </div>
      </template>
    </ResetPassword>

    <!-- 手机号模式 -->
    <ResetPassword
      v-else
      ref="phoneRef"
      verify-type="phone"
      title="重置密码"
      @send-code="handlePhoneSendCode"
      @verify-code="handlePhoneVerifyCode"
      @submit="handlePhoneSubmit"
      @complete="handleComplete"
    >
      <template #footer>
        <div class="demo-footer">
          <el-link underline="hover" :href="`/`">返回首页</el-link>
        </div>
      </template>
    </ResetPassword>
  </div>
</template>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  gap: 24px;
}

.demo-switch {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.demo-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
}
</style>
