/**
 * @module components
 * @description 组件库类型定义入口
 *
 * ## 组件列表
 *
 * ### ResetPassword - 重置密码组件
 * 支持邮箱和手机号两种验证方式，提供完整的密码重置流程。
 *
 * ### Register - 注册组件
 * 用户注册表单，包含人机验证、手机号验证、密码强度检测等功能。
 */

/** 重置密码组件类型 */
export type {
  VerifyType,
  StepType as ResetStepType,
  ResetFormData,
  ResetPasswordProps,
  ResetPasswordExpose
} from './ResetPassword/types'

/** 注册组件类型 */
export type {
  StepType as RegisterStepType,
  RegisterFormData,
  RegisterProps,
  RegisterExpose
} from './Register/types'
