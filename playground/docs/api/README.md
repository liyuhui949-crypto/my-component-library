**my-component-library-playground**

***

# my-component-library-playground

## Description

组件库类型定义入口

## 组件列表

### ResetPassword - 重置密码组件
支持邮箱和手机号两种验证方式，提供完整的密码重置流程。

### Register - 注册组件
用户注册表单，包含人机验证、手机号验证、密码强度检测等功能。

## Interfaces

| Interface | Description |
| ------ | ------ |
| [RegisterExpose](/api/interfaces/RegisterExpose.md) | 注册组件暴露的方法 |
| [RegisterFormData](/api/interfaces/RegisterFormData.md) | 收集到的表单数据 |
| [RegisterProps](/api/interfaces/RegisterProps.md) | 注册组件属性 |
| [ResetFormData](/api/interfaces/ResetFormData.md) | 收集到的表单数据 |
| [ResetPasswordExpose](/api/interfaces/ResetPasswordExpose.md) | 重置密码组件暴露的方法 |
| [ResetPasswordProps](/api/interfaces/ResetPasswordProps.md) | 重置密码组件属性 |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [RegisterStepType](/api/type-aliases/RegisterStepType.md) | 步骤类型 |
| [ResetStepType](/api/type-aliases/ResetStepType.md) | 步骤类型 |
| [VerifyType](/api/type-aliases/VerifyType.md) | 验证方式 |
