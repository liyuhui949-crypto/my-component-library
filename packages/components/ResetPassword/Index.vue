<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-07-07
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-07-07
 * @FilePath: \my-component-library\playground\src\components\ResetPassword\Index.vue
 * @Description: 重置密码组件 - 纯前端验证与信息收集
-->
<script setup lang="ts">
import { ref, computed, reactive, onUnmounted, watch } from 'vue'
import type { VerifyType, StepType, ResetFormData, ResetPasswordProps } from './types'

const props = withDefaults(defineProps<ResetPasswordProps>(), {
  verifyType: 'email',
  title: '重置密码',
  accountPlaceholder: '',
  codePlaceholder: '请输入验证码',
  passwordPlaceholder: '请输入新密码',
  confirmPlaceholder: '请再次输入密码',
  sendCodeText: '获取验证码',
  resendText: '重新获取',
  nextText: '下一步',
  resetText: '重置密码',
  backText: '返回',
  completeText: '完成',
  successTitle: '密码重置成功',
  successDesc: '您的密码已成功重置，现在可以使用新密码登录',
  codeLength: 6,
  minPasswordLength: 8,
  countdownDuration: 60,
  phoneArea: '+86'
})

/** Emits 定义 */
const emit = defineEmits<{
  /** 步骤变化 */
  stepChange: [step: StepType]
  /** 点击发送验证码（账号验证通过后触发） */
  sendCode: [account: string]
  /** 点击验证验证码（验证码格式验证通过后触发） */
  verifyCode: [account: string, code: string]
  /** 点击重置密码（密码验证通过后触发） */
  submit: [data: ResetFormData]
  /** 完成 */
  complete: []
}>()

/** 当前步骤 */
const currentStep = ref<StepType>('account')

/** 加载状态 */
const loading = ref(false)

/** 倒计时 */
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

/** 表单数据 */
const formData = reactive({
  account: '',
  code: '',
  password: '',
  confirmPassword: ''
})

/** 计算占位符 */
const computedAccountPlaceholder = computed(() => {
  if (props.accountPlaceholder) return props.accountPlaceholder
  return props.verifyType === 'email' ? '请输入邮箱地址' : '请输入手机号'
})

/** 密码强度 */
const passwordStrength = computed(() => {
  const pwd = formData.password
  if (!pwd) return 0

  let score = 0
  if (pwd.length >= props.minPasswordLength) score++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++

  return score
})

/** 密码强度文本 */
const strengthText = computed(() => {
  const texts = ['', '弱', '中', '强', '非常强']
  return texts[passwordStrength.value]
})

/** 当前步骤索引 */
const stepIndex = computed(() => {
  const steps: StepType[] = ['account', 'code', 'password', 'success']
  return steps.indexOf(currentStep.value)
})

/** 邮箱验证 */
const validateEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** 手机号验证 */
const validatePhone = (value: string): boolean => {
  return /^1[3-9]\d{9}$/.test(value)
}

/** 账号验证规则 */
const accountRules = computed(() => ({
  account: [
    { required: true, message: computedAccountPlaceholder.value, trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(new Error(computedAccountPlaceholder.value))
        } else if (props.verifyType === 'email' && !validateEmail(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else if (props.verifyType === 'phone' && !validatePhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

/** 验证码验证规则 */
const codeRules = computed(() => ({
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: props.codeLength, message: `验证码为${props.codeLength}位`, trigger: 'blur' }
  ]
}))

/** 密码验证规则 */
const passwordRules = computed(() => ({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: props.minPasswordLength, message: `密码长度至少${props.minPasswordLength}位`, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

/** 表单引用 */
const accountFormRef = ref()
const codeFormRef = ref()
const passwordFormRef = ref()

/** 第一步：发送验证码 */
const handleSendCode = async () => {
  try {
    await accountFormRef.value?.validate()
    loading.value = true
    emit('sendCode', formData.account)
  } catch {
    // 表单验证失败
  }
}

/** 重发验证码 */
const handleResend = () => {
  if (countdown.value > 0) return
  loading.value = true
  emit('sendCode', formData.account)
}

/** 开始倒计时 */
const startCountdown = () => {
  countdown.value = props.countdownDuration
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

/** 第二步：验证验证码 */
const handleVerifyCode = async () => {
  try {
    await codeFormRef.value?.validate()
    loading.value = true
    emit('verifyCode', formData.account, formData.code)
  } catch {
    // 表单验证失败
  }
}

/** 第三步：提交新密码 */
const handleSubmit = async () => {
  try {
    await passwordFormRef.value?.validate()
    loading.value = true
    emit('submit', {
      email: props.verifyType === 'email' ? formData.account : undefined,
      phone: props.verifyType === 'phone' ? formData.account : undefined,
      code: formData.code,
      password: formData.password
    })
  } catch {
    // 表单验证失败
  }
}

/** 返回上一步 */
const handleBack = () => {
  const steps: StepType[] = ['account', 'code', 'password']
  const idx = steps.indexOf(currentStep.value)
  if (idx > 0) {
    const prev = steps[idx - 1]
    currentStep.value = prev
    emit('stepChange', prev)
  }
}

/** 完成 */
const handleComplete = () => {
  emit('complete')
}

/** 组件卸载时清除定时器 */
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

/** 暴露方法给父组件 */
defineExpose({
  /** 设置加载状态 */
  setLoading(val: boolean) {
    loading.value = val
  },
  /** 获取加载状态 */
  getLoading() {
    return loading.value
  },
  /** 设置当前步骤 */
  setStep(step: StepType) {
    currentStep.value = step
    emit('stepChange', step)
  },
  /** 获取当前步骤 */
  getStep() {
    return currentStep.value
  },
  /** 跳转到验证码步骤（发送验证码成功后调用） */
  goToCodeStep() {
    startCountdown()
    currentStep.value = 'code'
    loading.value = false
    emit('stepChange', 'code')
  },
  /** 跳转到密码步骤（验证码验证成功后调用） */
  goToPasswordStep() {
    currentStep.value = 'password'
    loading.value = false
    emit('stepChange', 'password')
  },
  /** 跳转到成功步骤（密码重置成功后调用） */
  goToSuccessStep() {
    currentStep.value = 'success'
    loading.value = false
    emit('stepChange', 'success')
  },
  /** 获取已收集的表单数据 */
  getFormData(): ResetFormData {
    return {
      email: props.verifyType === 'email' ? formData.account : undefined,
      phone: props.verifyType === 'phone' ? formData.account : undefined,
      code: formData.code,
      password: formData.password
    }
  },
  /** 获取账号（邮箱或手机号） */
  getAccount() {
    return formData.account
  },
  /** 获取验证码 */
  getCode() {
    return formData.code
  },
  /** 获取密码（仅在密码步骤验证通过后有效） */
  getPassword() {
    return formData.password
  },
  /** 重置表单 */
  reset() {
    formData.account = ''
    formData.code = ''
    formData.password = ''
    formData.confirmPassword = ''
    currentStep.value = 'account'
    loading.value = false
    countdown.value = 0
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  },
  /** 开始倒计时 */
  startCountdown
})
</script>

<template>
  <div class="rp">
    <!-- 头部插槽 -->
    <slot name="header">
      <div class="rp__header">
        <h2 class="rp__title">{{ title }}</h2>
      </div>
    </slot>

    <!-- 步骤指示器 -->
    <slot name="steps" :step="currentStep" :step-index="stepIndex">
      <div class="rp__steps">
        <div
          class="rp__step"
          :class="{
            'rp__step--active': stepIndex >= 0,
            'rp__step--done': stepIndex > 0
          }"
        >
          <span class="rp__step-num">1</span>
          <span class="rp__step-label">{{ verifyType === 'email' ? '验证邮箱' : '验证手机' }}</span>
        </div>
        <div class="rp__step-line" :class="{ 'rp__step-line--active': stepIndex > 0 }"></div>
        <div
          class="rp__step"
          :class="{
            'rp__step--active': stepIndex >= 1,
            'rp__step--done': stepIndex > 1
          }"
        >
          <span class="rp__step-num">2</span>
          <span class="rp__step-label">输入验证码</span>
        </div>
        <div class="rp__step-line" :class="{ 'rp__step-line--active': stepIndex > 1 }"></div>
        <div
          class="rp__step"
          :class="{
            'rp__step--active': stepIndex >= 2,
            'rp__step--done': stepIndex > 2
          }"
        >
          <span class="rp__step-num">3</span>
          <span class="rp__step-label">设置密码</span>
        </div>
      </div>
    </slot>

    <!-- 步骤 1: 账号输入 -->
    <div v-if="currentStep === 'account'" class="rp__form">
      <slot name="account-form-prefix"></slot>
      <el-form ref="accountFormRef" :model="formData" :rules="accountRules">
        <el-form-item prop="account">
          <template v-if="verifyType === 'phone'">
            <el-input
              v-model="formData.account"
              :placeholder="computedAccountPlaceholder"
              size="large"
            >
              <template #prepend>{{ phoneArea }}</template>
            </el-input>
          </template>
          <el-input
            v-else
            v-model="formData.account"
            :placeholder="computedAccountPlaceholder"
            size="large"
          />
        </el-form-item>
      </el-form>
      <slot name="account-form-suffix"></slot>
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        class="rp__btn"
        @click="handleSendCode"
      >
        {{ sendCodeText }}
      </el-button>
      <slot name="account-extra"></slot>
    </div>

    <!-- 步骤 2: 验证码输入 -->
    <div v-else-if="currentStep === 'code'" class="rp__form">
      <slot name="code-form-prefix">
        <p class="rp__hint">
          验证码已发送至
          <strong v-if="verifyType === 'email'">{{ formData.account }}</strong>
          <strong v-else>{{ phoneArea }} {{ formData.account }}</strong>
        </p>
      </slot>
      <el-form ref="codeFormRef" :model="formData" :rules="codeRules">
        <el-form-item prop="code">
          <el-input
            v-model="formData.code"
            :placeholder="codePlaceholder"
            size="large"
            :maxlength="codeLength"
          />
        </el-form-item>
      </el-form>
      <div class="rp__resend">
        <span v-if="countdown > 0" class="rp__countdown">{{ countdown }}s</span>
        <el-link
          v-else
          type="primary"
          :underline="false"
          :disabled="loading"
          @click="handleResend"
        >
          {{ resendText }}
        </el-link>
      </div>
      <slot name="code-form-suffix"></slot>
      <div class="rp__actions">
        <el-button size="large" @click="handleBack">{{ backText }}</el-button>
        <el-button type="primary" size="large" :loading="loading" @click="handleVerifyCode">
          {{ nextText }}
        </el-button>
      </div>
    </div>

    <!-- 步骤 3: 设置新密码 -->
    <div v-else-if="currentStep === 'password'" class="rp__form">
      <slot name="password-form-prefix"></slot>
      <el-form ref="passwordFormRef" :model="formData" :rules="passwordRules">
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="passwordPlaceholder"
            size="large"
            show-password
          />
        </el-form-item>
        <div v-if="formData.password" class="rp__strength">
          <div class="rp__strength-bars">
            <div
              v-for="i in 4"
              :key="i"
              class="rp__strength-bar"
              :class="{ 'rp__strength-bar--active': passwordStrength >= i }"
            ></div>
          </div>
          <span class="rp__strength-text">{{ strengthText }}</span>
        </div>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            :placeholder="confirmPlaceholder"
            size="large"
            show-password
          />
        </el-form-item>
      </el-form>
      <slot name="password-form-suffix"></slot>
      <div class="rp__actions">
        <el-button size="large" @click="handleBack">{{ backText }}</el-button>
        <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
          {{ resetText }}
        </el-button>
      </div>
    </div>

    <!-- 步骤 4: 成功 -->
    <div v-else-if="currentStep === 'success'" class="rp__success">
      <slot name="success">
        <div class="rp__success-icon">✓</div>
        <h3 class="rp__success-title">{{ successTitle }}</h3>
        <p class="rp__success-desc">{{ successDesc }}</p>
        <el-button type="primary" size="large" @click="handleComplete">
          {{ completeText }}
        </el-button>
      </slot>
    </div>

    <!-- 底部插槽 -->
    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss" scoped>
.rp {
  width: 100%;
  max-width: 400px;
  padding: 32px;

  &__header {
    margin-bottom: 32px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #171717;
    letter-spacing: -0.5px;
  }

  // 步骤指示器
  &__steps {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
  }

  &__step {
    display: flex;
    align-items: center;
    gap: 8px;

    &-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e5e5e5;
      color: #737373;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s;
    }

    &-label {
      font-size: 13px;
      color: #a3a3a3;
      transition: color 0.2s;
    }

    &--active {
      .rp__step-num {
        background: #171717;
        color: #fff;
      }

      .rp__step-label {
        color: #171717;
      }
    }

    &--done {
      .rp__step-num {
        background: #16a34a;
        color: #fff;
      }
    }

    &-line {
      flex: 1;
      height: 1px;
      background: #e5e5e5;
      margin: 0 12px;
      transition: background 0.2s;

      &--active {
        background: #171717;
      }
    }
  }

  // 表单
  &__form {
    :deep(.el-input__wrapper) {
      border-radius: 6px;
    }

    :deep(.el-input-group__prepend) {
      background: #f5f5f5;
      border-radius: 6px 0 0 6px;
    }
  }

  &__hint {
    margin: 0 0 16px;
    font-size: 14px;
    color: #525252;

    strong {
      color: #171717;
    }
  }

  &__resend {
    margin-bottom: 24px;
    font-size: 14px;
  }

  &__countdown {
    color: #737373;
  }

  // 密码强度
  &__strength {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: -8px 0 16px;

    &-bars {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    &-bar {
      height: 3px;
      flex: 1;
      background: #e5e5e5;
      border-radius: 2px;
      transition: background 0.2s;

      &--active {
        background: #171717;
      }
    }

    &-text {
      font-size: 12px;
      color: #737373;
      min-width: 32px;
    }
  }

  // 按钮
  &__btn {
    width: 100%;
  }

  &__actions {
    display: flex;
    gap: 12px;

    .el-button {
      flex: 1;
    }
  }

  // 成功状态
  &__success {
    text-align: center;
    padding: 24px 0;

    &-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #16a34a;
      color: #fff;
      font-size: 24px;
      margin-bottom: 16px;
    }

    &-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #171717;
    }

    &-desc {
      margin: 0 0 24px;
      font-size: 14px;
      color: #525252;
    }
  }
}
</style>
