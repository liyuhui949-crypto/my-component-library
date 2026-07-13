# Register 类型定义

## `StepType`

```ts
type StepType = 'form' | 'success'
```

## `RegisterFormData`

收集到的表单数据

| 属性 | 类型 | 说明 |
|------|------|------|
| name | `string` | 姓名 |
| phone | `string` | 手机号 |
| password | `string` | 密码 |
| email? | `string` | 邮箱（选填） |
| address? | `string` | 地址（选填） |

## `RegisterProps`

注册组件属性

| 属性 | 类型 | 说明 |
|------|------|------|
| title? | `string` | 标题 |
| namePlaceholder? | `string` | 姓名输入框占位符 |
| phonePlaceholder? | `string` | 手机号输入框占位符 |
| passwordPlaceholder? | `string` | 密码输入框占位符 |
| confirmPlaceholder? | `string` | 确认密码输入框占位符 |
| emailPlaceholder? | `string` | 邮箱输入框占位符 |
| addressPlaceholder? | `string` | 地址输入框占位符 |
| sendCodeText? | `string` | 发送验证码按钮文字 |
| resendText? | `string` | 重发验证码按钮文字 |
| registerText? | `string` | 注册按钮文字 |
| successTitle? | `string` | 成功提示标题 |
| successDesc? | `string` | 成功提示描述 |
| loginText? | `string` | 去登录按钮文字 |
| codeLength? | `number` | 验证码长度 |
| minPasswordLength? | `number` | 密码最小长度 |
| countdownDuration? | `number` | 倒计时时长（秒） |
| phoneArea? | `string` | 手机号区号 |
| showEmail? | `boolean` | 是否显示邮箱字段 |
| showAddress? | `boolean` | 是否显示地址字段 |
| enableCaptcha? | `boolean` | 是否启用人机验证 |

## `RegisterExpose`

注册组件暴露的方法

| 属性 | 类型 | 说明 |
|------|------|------|
| setLoading | `(val: boolean) => void` | 设置加载状态 |
| getLoading | `() => boolean` | 获取加载状态 |
| setStep | `(step: StepType) => void` | 设置当前步骤 |
| getStep | `() => StepType` | 获取当前步骤 |
| markCodeSent | `() => void` | 标记验证码已发送并开始倒计时 |
| markCodeVerified | `() => void` | 标记验证码已验证通过 |
| goToSuccessStep | `(password?: string) => void` | 跳转到成功步骤（注册成功后调用） |
| getFormData | `() => RegisterFormData` | 获取已收集的表单数据 |
| reset | `() => void` | 重置表单 |
