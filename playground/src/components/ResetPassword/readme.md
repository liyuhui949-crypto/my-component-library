### 支持邮箱/手机号两种模式

```vue
<!-- 邮箱模式 -->
<ResetPassword verify-type="email" @send-code="onSend" />

<!-- 手机号模式 -->
<ResetPassword verify-type="phone" @send-code="onSend" />
```

### 组件只负责前端验证 + 信息收集

```ts
// 父组件控制流程
const handleSendCode = async (account: string) => {
  await api.sendCode(account); // 调接口
  ref.value.goToCodeStep(); // 跳转步骤
};

const handleSubmit = async (data: ResetFormData) => {
  await api.resetPassword(data); // 调接口
  ref.value.goToSuccessStep(); // 跳转步骤
};
```

### 暴露的方法

| 方法                 | 说明                                              |
| -------------------- | ------------------------------------------------- |
| `getFormData()`      | 获取完整数据 `{ email?, phone?, code, password }` |
| `getAccount()`       | 获取账号                                          |
| `getCode()`          | 获取验证码                                        |
| `getPassword()`      | 获取密码                                          |
| `goToCodeStep()`     | 跳转验证码步骤 + 开始倒计时 + 关闭loading         |
| `goToPasswordStep()` | 跳转密码步骤 + 关闭loading                        |
| `goToSuccessStep()`  | 跳转成功步骤 + 关闭loading                        |
| `setLoading(val)`    | 手动控制loading                                   |
| `reset()`            | 重置表单                                          |

### 事件

| 事件         | 参数              | 说明           |
| ------------ | ----------------- | -------------- |
| `sendCode`   | `account: string` | 点击发送验证码 |
| `verifyCode` | `account, code`   | 点击验证验证码 |
| `submit`     | `ResetFormData`   | 点击重置密码   |
| `stepChange` | `step: StepType`  | 步骤变化       |
| `complete`   | -                 | 点击完成       |
