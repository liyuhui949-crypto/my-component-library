/** 验证方式 */
export type VerifyType = 'email' | 'phone'

/** 步骤类型 */
export type StepType = 'account' | 'code' | 'password' | 'success'

/** 收集到的表单数据 */
export interface ResetFormData {
  email?: string
  phone?: string
  code: string
  password: string
}

/** Props 定义 */
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
