/**
 * 注册组件类型定义
 * @module Register
 */

/** 步骤类型 */
export type StepType = 'form' | 'success'

/** 收集到的表单数据 */
export interface RegisterFormData {
  /** 姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
  /** 邮箱（选填） */
  email?: string
  /** 地址（选填） */
  address?: string
}

/** 注册组件属性 */
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

/** 注册组件暴露的方法 */
export interface RegisterExpose {
  /** 设置加载状态 */
  setLoading: (val: boolean) => void
  /** 获取加载状态 */
  getLoading: () => boolean
  /** 设置当前步骤 */
  setStep: (step: StepType) => void
  /** 获取当前步骤 */
  getStep: () => StepType
  /** 标记验证码已发送并开始倒计时 */
  markCodeSent: () => void
  /** 标记验证码已验证通过 */
  markCodeVerified: () => void
  /** 跳转到成功步骤（注册成功后调用） */
  goToSuccessStep: (password?: string) => void
  /** 获取已收集的表单数据 */
  getFormData: () => RegisterFormData
  /** 重置表单 */
  reset: () => void
}
