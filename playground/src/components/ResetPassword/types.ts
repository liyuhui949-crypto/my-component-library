/**
 * 重置密码组件类型定义
 * @module ResetPassword
 */

/** 验证方式 */
export type VerifyType = 'email' | 'phone'

/** 步骤类型 */
export type StepType = 'account' | 'code' | 'password' | 'success'

/** 收集到的表单数据 */
export interface ResetFormData {
  /** 邮箱地址（邮箱验证时） */
  email?: string
  /** 手机号（手机验证时） */
  phone?: string
  /** 验证码 */
  code: string
  /** 新密码 */
  password: string
}

/** 重置密码组件属性 */
export interface ResetPasswordProps {
  /** 验证方式 */
  verifyType?: VerifyType
  /** 标题 */
  title?: string
  /** 账号输入框占位符 */
  accountPlaceholder?: string
  /** 验证码输入框占位符 */
  codePlaceholder?: string
  /** 密码输入框占位符 */
  passwordPlaceholder?: string
  /** 确认密码输入框占位符 */
  confirmPlaceholder?: string
  /** 发送验证码按钮文字 */
  sendCodeText?: string
  /** 重发验证码按钮文字 */
  resendText?: string
  /** 下一步按钮文字 */
  nextText?: string
  /** 重置按钮文字 */
  resetText?: string
  /** 返回按钮文字 */
  backText?: string
  /** 完成按钮文字 */
  completeText?: string
  /** 成功提示标题 */
  successTitle?: string
  /** 成功提示描述 */
  successDesc?: string
  /** 验证码长度 */
  codeLength?: number
  /** 密码最小长度 */
  minPasswordLength?: number
  /** 倒计时时长（秒） */
  countdownDuration?: number
  /** 手机号区号 */
  phoneArea?: string
}

/** 重置密码组件暴露的方法 */
export interface ResetPasswordExpose {
  /** 设置加载状态 */
  setLoading: (val: boolean) => void
  /** 获取加载状态 */
  getLoading: () => boolean
  /** 设置当前步骤 */
  setStep: (step: StepType) => void
  /** 获取当前步骤 */
  getStep: () => StepType
  /** 跳转到验证码步骤（发送验证码成功后调用） */
  goToCodeStep: () => void
  /** 跳转到密码步骤（验证码验证成功后调用） */
  goToPasswordStep: () => void
  /** 跳转到成功步骤（密码重置成功后调用） */
  goToSuccessStep: () => void
  /** 获取已收集的表单数据 */
  getFormData: () => ResetFormData
  /** 获取账号（邮箱或手机号） */
  getAccount: () => string
  /** 获取验证码 */
  getCode: () => string
  /** 获取密码（仅在密码步骤验证通过后有效） */
  getPassword: () => string
  /** 重置表单 */
  reset: () => void
  /** 开始倒计时 */
  startCountdown: () => void
}
