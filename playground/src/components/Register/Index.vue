<!--
 * @Author: 李玉辉 liyuhui949@gmail.com
 * @Date: 2026-07-07
 * @LastEditors: 李玉辉 liyuhui949@gmail.com
 * @LastEditTime: 2026-07-07
 * @FilePath: \my-component-library\playground\src\components\Register\Index.vue
 * @Description: 注册组件 - 纯前端验证与信息收集
-->
<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

/** 步骤类型 */
export type StepType = 'form' | 'success'

/** 收集到的表单数据 */
export interface RegisterFormData {
  name: string
  phone: string
  password: string
  email?: string
  address?: string
}

/** Props 定义 */
export interface RegisterProps {
  /** 标题 */
  title?: string
  /** 姓名输入框占位符 */
  namePlaceholder?: string
  /** 手机号输入框占位符 */
  phonePlaceholder?: string
  /** 密码输入框占位符 */
  passwordPlaceholder?: string
  /** 确认密码输入框占位符 */
  confirmPlaceholder?: string
  /** 邮箱输入框占位符 */
  emailPlaceholder?: string
  /** 地址输入框占位符 */
  addressPlaceholder?: string
  /** 发送验证码按钮文字 */
  sendCodeText?: string
  /** 重发验证码按钮文字 */
  resendText?: string
  /** 注册按钮文字 */
  registerText?: string
  /** 成功提示标题 */
  successTitle?: string
  /** 成功提示描述 */
  successDesc?: string
  /** 去登录按钮文字 */
  loginText?: string
  /** 验证码长度 */
  codeLength?: number
  /** 密码最小长度 */
  minPasswordLength?: number
  /** 倒计时时长（秒） */
  countdownDuration?: number
  /** 手机号区号 */
  phoneArea?: string
  /** 是否显示邮箱字段 */
  showEmail?: boolean
  /** 是否显示地址字段 */
  showAddress?: boolean
  /** 是否启用人机验证 */
  enableCaptcha?: boolean
}

const props = withDefaults(defineProps<RegisterProps>(), {
  title: '用户注册',
  namePlaceholder: '请输入姓名',
  phonePlaceholder: '请输入手机号',
  passwordPlaceholder: '请输入密码',
  confirmPlaceholder: '请再次输入密码',
  emailPlaceholder: '请输入邮箱（选填）',
  addressPlaceholder: '请输入地址（选填）',
  sendCodeText: '获取验证码',
  resendText: '重新获取',
  registerText: '注册',
  successTitle: '注册成功',
  successDesc: '您的账号已注册成功，请妥善保管密码',
  loginText: '去登录',
  codeLength: 6,
  minPasswordLength: 8,
  countdownDuration: 60,
  phoneArea: '+86',
  showEmail: true,
  showAddress: true,
  enableCaptcha: true
})

/** Emits 定义 */
const emit = defineEmits<{
  /** 点击发送验证码 */
  sendCode: [phone: string]
  /** 验证码验证（父组件调用接口验证后标记通过） */
  verifyCode: [phone: string, code: string]
  /** 点击注册（前端验证通过后触发） */
  submit: [data: RegisterFormData]
  /** 去登录 */
  login: []
}>()

/** 当前步骤 */
const currentStep = ref<StepType>('form')

/** 加载状态 */
const loading = ref(false)

/** 倒计时 */
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

/** 验证码已发送状态 */
const codeSent = ref(false)

/** 验证码已验证状态 */
const codeVerified = ref(false)

/** 人机验证状态 */
const captchaVerified = ref(false)

/** 拖拽验证相关 */
const dragRef = ref<HTMLElement>()
const dragBarRef = ref<HTMLElement>()
const dragX = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)

/** 密码显示状态 */
const passwordVisible = ref(false)

/** 注册后的密码（用于展示） */
const registeredPassword = ref('')

/** 表单数据 */
const formData = reactive({
  name: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  email: '',
  address: ''
})

/** 手机号验证 */
const validatePhone = (value: string): boolean => {
  return /^1[3-9]\d{9}$/.test(value)
}

/** 邮箱验证 */
const validateEmail = (value: string): boolean => {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

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

/** 表单验证规则 */
const formRules = computed(() => ({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!validatePhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: props.codeLength, message: `验证码为${props.codeLength}位`, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
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
  ],
  email: [
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value && !validateEmail(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

/** 表单引用 */
const formRef = ref()

/** 发送验证码 */
const handleSendCode = async () => {
  try {
    await formRef.value?.validateField('phone')
    if (props.enableCaptcha && !captchaVerified.value) {
      ElMessage.warning('请先完成人机验证')
      return
    }
    loading.value = true
    codeVerified.value = false
    emit('sendCode', formData.phone)
  } catch {
    // 验证失败
  }
}

/** 重发验证码 */
const handleResend = () => {
  if (countdown.value > 0) return
  loading.value = true
  codeVerified.value = false
  emit('sendCode', formData.phone)
}

/** 开始倒计时 */
const startCountdown = () => {
  codeSent.value = true
  countdown.value = props.countdownDuration
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

/** 验证验证码 */
const handleVerifyCode = async () => {
  try {
    await formRef.value?.validateField('code')
    loading.value = true
    emit('verifyCode', formData.phone, formData.code)
  } catch {
    // 验证失败
  }
}

/** 提交注册 */
const handleRegister = async () => {
  if (!codeVerified.value) {
    ElMessage.warning('请先验证验证码')
    return
  }
  try {
    await formRef.value?.validate()
    loading.value = true
    emit('submit', {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      email: formData.email || undefined,
      address: formData.address || undefined
    })
  } catch {
    // 验证失败
  }
}

/** 去登录 */
const handleLogin = () => {
  emit('login')
}

/** 复制密码 */
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(registeredPassword.value)
    ElMessage.success('密码已复制到剪贴板')
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = registeredPassword.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('密码已复制到剪贴板')
  }
}

/** ========== 拖拽验证 ========== */

/** 拖拽开始 */
const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (captchaVerified.value) return
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  dragStartX.value = clientX - dragX.value

  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove)
  document.addEventListener('touchend', handleDragEnd)
}

/** 拖拽中 */
const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  let x = clientX - dragStartX.value

  // 限制范围
  const max = 260 // 拖拽区域宽度 - 滑块宽度
  if (x < 0) x = 0
  if (x > max) x = max

  dragX.value = x
}

/** 拖拽结束 */
const handleDragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)

  // 判断是否拖到最右边
  const max = 260
  if (dragX.value >= max - 10) {
    captchaVerified.value = true
    dragX.value = max
    ElMessage.success('验证通过')
  } else {
    // 回弹
    dragX.value = 0
  }
}

/** 组件卸载时清除定时器 */
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
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
  },
  /** 获取当前步骤 */
  getStep() {
    return currentStep.value
  },
  /** 标记验证码已发送并开始倒计时 */
  markCodeSent() {
    startCountdown()
    loading.value = false
  },
  /** 标记验证码已验证通过 */
  markCodeVerified() {
    codeVerified.value = true
    loading.value = false
  },
  /** 跳转到成功步骤（注册成功后调用） */
  goToSuccessStep(password?: string) {
    registeredPassword.value = password || formData.password
    currentStep.value = 'success'
    loading.value = false
  },
  /** 获取已收集的表单数据 */
  getFormData(): RegisterFormData {
    return {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      email: formData.email || undefined,
      address: formData.address || undefined
    }
  },
  /** 重置表单 */
  reset() {
    formData.name = ''
    formData.phone = ''
    formData.code = ''
    formData.password = ''
    formData.confirmPassword = ''
    formData.email = ''
    formData.address = ''
    currentStep.value = 'form'
    loading.value = false
    codeSent.value = false
    codeVerified.value = false
    captchaVerified.value = false
    passwordVisible.value = false
    registeredPassword.value = ''
    dragX.value = 0
    countdown.value = 0
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
})
</script>

<template>
  <div class="reg">
    <!-- 头部插槽 -->
    <slot name="header">
      <div class="reg__header">
        <h2 class="reg__title">{{ title }}</h2>
      </div>
    </slot>

    <!-- 步骤 1: 收集信息 -->
    <div v-if="currentStep === 'form'" class="reg__form">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="namePlaceholder"
            size="large"
          />
        </el-form-item>

        <!-- 手机号 + 验证码按钮 -->
        <el-form-item label="手机号" prop="phone">
          <div class="reg__phone-row">
            <el-input
              v-model="formData.phone"
              :placeholder="phonePlaceholder"
              size="large"
            >
              <template #prepend>{{ phoneArea }}</template>
            </el-input>
            <el-button
              size="large"
              :disabled="(countdown > 0) || (enableCaptcha && !captchaVerified)"
              :loading="loading && !codeSent"
              @click="codeSent ? handleResend() : handleSendCode()"
            >
              <template v-if="countdown > 0">{{ countdown }}s</template>
              <template v-else>{{ codeSent ? resendText : sendCodeText }}</template>
            </el-button>
          </div>
        </el-form-item>

        <!-- 人机验证 -->
        <el-form-item v-if="enableCaptcha" label="人机验证">
          <div class="reg__captcha">
            <div v-if="captchaVerified" class="reg__captcha-success">
              <span class="reg__captcha-icon">✓</span>
              <span>验证通过</span>
            </div>
            <div v-else ref="dragRef" class="reg__captcha-track">
              <div
                ref="dragBarRef"
                class="reg__captcha-bar"
                :style="{ transform: `translateX(${dragX}px)` }"
                @mousedown="handleDragStart"
                @touchstart.prevent="handleDragStart"
              >
                <span>→</span>
              </div>
              <span class="reg__captcha-text">请拖动滑块到最右边</span>
            </div>
          </div>
        </el-form-item>

        <!-- 验证码（发送后显示） -->
        <el-form-item v-if="codeSent" label="验证码" prop="code">
          <div class="reg__code-row">
            <el-input
              v-model="formData.code"
              :placeholder="`请输入${codeLength}位验证码`"
              size="large"
              :maxlength="codeLength"
              :disabled="codeVerified"
            />
            <el-button
              v-if="!codeVerified"
              size="large"
              type="success"
              :loading="loading && codeSent"
              @click="handleVerifyCode"
            >
              验证
            </el-button>
            <span v-else class="reg__code-verified">✓ 已验证</span>
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            :type="passwordVisible ? 'text' : 'password'"
            :placeholder="passwordPlaceholder"
            size="large"
            show-password
          />
          <div v-if="formData.password" class="reg__strength">
            <div class="reg__strength-bars">
              <div
                v-for="i in 4"
                :key="i"
                class="reg__strength-bar"
                :class="{ 'reg__strength-bar--active': passwordStrength >= i }"
              ></div>
            </div>
            <span class="reg__strength-text">{{ strengthText }}</span>
          </div>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            :type="passwordVisible ? 'text' : 'password'"
            :placeholder="confirmPlaceholder"
            size="large"
            show-password
          />
        </el-form-item>

        <!-- 邮箱（选填） -->
        <el-form-item v-if="showEmail" label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            :placeholder="emailPlaceholder"
            size="large"
          />
        </el-form-item>

        <!-- 地址（选填） -->
        <el-form-item v-if="showAddress" label="地址" prop="address">
          <el-input
            v-model="formData.address"
            :placeholder="addressPlaceholder"
            size="large"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>

      <slot name="form-suffix"></slot>

      <el-button
        type="primary"
        size="large"
        :loading="loading"
        :disabled="!codeVerified"
        class="reg__btn"
        @click="handleRegister"
      >
        {{ registerText }}
      </el-button>
    </div>

    <!-- 步骤 2: 注册成功 -->
    <div v-else-if="currentStep === 'success'" class="reg__success">
      <slot name="success">
        <div class="reg__success-icon">✓</div>
        <h3 class="reg__success-title">{{ successTitle }}</h3>
        <p class="reg__success-desc">{{ successDesc }}</p>

        <!-- 密码展示 -->
        <div class="reg__password-box">
          <span class="reg__password-label">您的密码</span>
          <div class="reg__password-value">
            <span>{{ passwordVisible ? registeredPassword : '••••••••' }}</span>
            <el-button
              text
              @click="passwordVisible = !passwordVisible"
            >
              {{ passwordVisible ? '隐藏' : '展示' }}
            </el-button>
            <el-button
              text
              @click="handleCopy"
            >
              复制
            </el-button>
          </div>
        </div>

        <el-button type="primary" size="large" class="reg__btn" @click="handleLogin">
          {{ loginText }}
        </el-button>
      </slot>
    </div>

    <!-- 底部插槽 -->
    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss" scoped>
.reg {
  width: 100%;
  max-width: 480px;
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

  // 表单
  &__form {
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #171717;
    }

    :deep(.el-input__wrapper),
    :deep(.el-textarea__inner) {
      border-radius: 6px;
    }

    :deep(.el-input-group__prepend) {
      background: #f5f5f5;
      border-radius: 6px 0 0 6px;
    }
  }

  &__phone-row,
  &__code-row {
    display: flex;
    gap: 12px;
    width: 100%;

    .el-input {
      flex: 1;
    }

    .el-button {
      flex-shrink: 0;
      min-width: 100px;
    }
  }

  &__code-verified {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #16a34a;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }

  // 人机验证
  &__captcha {
    width: 100%;
  }

  &__captcha-track {
    position: relative;
    height: 40px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    overflow: hidden;
  }

  &__captcha-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 100%;
    background: #171717;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
    font-size: 16px;
    font-weight: 600;
    transition: background 0.2s;
    z-index: 1;

    &:active {
      cursor: grabbing;
      background: #333;
    }
  }

  &__captcha-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 13px;
    color: #a3a3a3;
    pointer-events: none;
  }

  &__captcha-success {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    color: #16a34a;
    font-size: 14px;
  }

  &__captcha-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: #16a34a;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
  }

  // 密码强度
  &__strength {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;

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
    margin-top: 8px;
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

  // 密码展示框
  &__password-box {
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: left;
  }

  &__password-label {
    display: block;
    font-size: 12px;
    color: #737373;
    margin-bottom: 8px;
  }

  &__password-value {
    display: flex;
    align-items: center;
    gap: 8px;

    span:first-child {
      flex: 1;
      font-size: 16px;
      font-family: monospace;
      color: #171717;
      letter-spacing: 2px;
    }

    .el-button {
      color: #525252;

      &:hover {
        color: #171717;
      }
    }
  }
}
</style>
