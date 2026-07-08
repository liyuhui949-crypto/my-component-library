[**my-component-library-playground**](../README.md)

***

# Interface: RegisterExpose

Defined in: [Register/types.ts:68](https://github.com/liyuhui949-crypto/my-component-library/blob/b2c5b094222f9ae683209abc15618b91a6ffd155/playground/src/components/Register/types.ts#L68)

注册组件暴露的方法

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="getformdata"></a> `getFormData` | () => [`RegisterFormData`](/api/interfaces/RegisterFormData.md) | 获取已收集的表单数据 |
| <a id="getloading"></a> `getLoading` | () => `boolean` | 获取加载状态 |
| <a id="getstep"></a> `getStep` | () => [`RegisterStepType`](/api/type-aliases/RegisterStepType.md) | 获取当前步骤 |
| <a id="gotosuccessstep"></a> `goToSuccessStep` | (`password?`) => `void` | 跳转到成功步骤（注册成功后调用） |
| <a id="markcodesent"></a> `markCodeSent` | () => `void` | 标记验证码已发送并开始倒计时 |
| <a id="markcodeverified"></a> `markCodeVerified` | () => `void` | 标记验证码已验证通过 |
| <a id="reset"></a> `reset` | () => `void` | 重置表单 |
| <a id="setloading"></a> `setLoading` | (`val`) => `void` | 设置加载状态 |
| <a id="setstep"></a> `setStep` | (`step`) => `void` | 设置当前步骤 |
