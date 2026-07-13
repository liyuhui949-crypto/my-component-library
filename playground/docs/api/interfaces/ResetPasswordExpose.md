[**my-component-library-playground**](../README.md)

***

# Interface: ResetPasswordExpose

Defined in: [ResetPassword/types.ts:65](https://github.com/liyuhui949-crypto/my-component-library/blob/b2c5b094222f9ae683209abc15618b91a6ffd155/playground/src/components/ResetPassword/types.ts#L65)

重置密码组件暴露的方法

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="getaccount"></a> `getAccount` | () => `string` | 获取账号（邮箱或手机号） |
| <a id="getcode"></a> `getCode` | () => `string` | 获取验证码 |
| <a id="getformdata"></a> `getFormData` | () => [`ResetFormData`](/api/interfaces/ResetFormData.md) | 获取已收集的表单数据 |
| <a id="getloading"></a> `getLoading` | () => `boolean` | 获取加载状态 |
| <a id="getpassword"></a> `getPassword` | () => `string` | 获取密码（仅在密码步骤验证通过后有效） |
| <a id="getstep"></a> `getStep` | () => [`ResetStepType`](/api/type-aliases/ResetStepType.md) | 获取当前步骤 |
| <a id="gotocodestep"></a> `goToCodeStep` | () => `void` | 跳转到验证码步骤（发送验证码成功后调用） |
| <a id="gotopasswordstep"></a> `goToPasswordStep` | () => `void` | 跳转到密码步骤（验证码验证成功后调用） |
| <a id="gotosuccessstep"></a> `goToSuccessStep` | () => `void` | 跳转到成功步骤（密码重置成功后调用） |
| <a id="reset"></a> `reset` | () => `void` | 重置表单 |
| <a id="setloading"></a> `setLoading` | (`val`) => `void` | 设置加载状态 |
| <a id="setstep"></a> `setStep` | (`step`) => `void` | 设置当前步骤 |
| <a id="startcountdown"></a> `startCountdown` | () => `void` | 开始倒计时 |
