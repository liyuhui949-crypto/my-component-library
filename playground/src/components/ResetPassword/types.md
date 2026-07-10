# ResetPassword 类型定义

## `VerifyType`

验证方式

```ts
type VerifyType = 'email' | 'phone'
```

## `StepType`

步骤类型

```ts
type StepType = 'account' | 'code' | 'password' | 'success'
```

## `ResetFormData`

收集到的表单数据

| 属性 | 类型 | 说明 |
|------|------|------|
| email? | `string` | - |
| phone? | `string` | - |
| code | `string` | - |
| password | `string` | - |

## `ResetPasswordProps`

Props 定义

| 属性 | 类型 | 说明 |
|------|------|------|
| verifyType? | `VerifyType` | 验证方式 |
| title? | `string` | 标题 |
| accountPlaceholder? | `string` | 账号输入框占位符 |
| codePlaceholder? | `string` | 验证码输入框占位符 |
| passwordPlaceholder? | `string` | 密码输入框占位符 |
| confirmPlaceholder? | `string` | 确认密码输入框占位符 |
| sendCodeText? | `string` | 发送验证码按钮文字 |
| resendText? | `string` | 重发验证码按钮文字 |
| nextText? | `string` | 下一步按钮文字 |
| resetText? | `string` | 重置按钮文字 |
| backText? | `string` | 返回按钮文字 |
| completeText? | `string` | 完成按钮文字 |
| successTitle? | `string` | 成功提示标题 |
| successDesc? | `string` | 成功提示描述 |
| codeLength? | `number` | 验证码长度 |
| minPasswordLength? | `number` | 密码最小长度 |
| countdownDuration? | `number` | 倒计时时长（秒） |
| phoneArea? | `string` | 手机号区号 |
