import type { ComponentAPI } from "../global-types";

export default {
  load(): ComponentAPI {
    return {
      componentName: "ElResetPassword",
      props: [
        {
          name: "verifyType",
          type: "'email',",
          default: "'email'",
          required: true,
          description: ""
        },
        {
          name: "title",
          type: "'重置密码',",
          default: "'重置密码'",
          required: true,
          description: ""
        },
        {
          name: "accountPlaceholder",
          type: "'',",
          default: "''",
          required: true,
          description: ""
        },
        {
          name: "codePlaceholder",
          type: "'请输入验证码',",
          default: "'请输入验证码'",
          required: true,
          description: ""
        },
        {
          name: "passwordPlaceholder",
          type: "'请输入新密码',",
          default: "'请输入新密码'",
          required: true,
          description: ""
        },
        {
          name: "confirmPlaceholder",
          type: "'请再次输入密码',",
          default: "'请再次输入密码'",
          required: true,
          description: ""
        },
        {
          name: "sendCodeText",
          type: "'获取验证码',",
          default: "'获取验证码'",
          required: true,
          description: ""
        },
        {
          name: "resendText",
          type: "'重新获取',",
          default: "'重新获取'",
          required: true,
          description: ""
        },
        {
          name: "nextText",
          type: "'下一步',",
          default: "'下一步'",
          required: true,
          description: ""
        },
        {
          name: "resetText",
          type: "'重置密码',",
          default: "'重置密码'",
          required: true,
          description: ""
        },
        {
          name: "backText",
          type: "'返回',",
          default: "'返回'",
          required: true,
          description: ""
        },
        {
          name: "completeText",
          type: "'完成',",
          default: "'完成'",
          required: true,
          description: ""
        },
        {
          name: "successTitle",
          type: "'密码重置成功',",
          default: "'密码重置成功'",
          required: true,
          description: ""
        },
        {
          name: "successDesc",
          type: "'您的密码已成功重置，现在可以使用新密码登录',",
          default: "'您的密码已成功重置，现在可以使用新密码登录'",
          required: true,
          description: ""
        },
        {
          name: "codeLength",
          type: "6,",
          default: "6",
          required: true,
          description: ""
        },
        {
          name: "minPasswordLength",
          type: "8,",
          default: "8",
          required: true,
          description: ""
        },
        {
          name: "countdownDuration",
          type: "60,",
          default: "60",
          required: true,
          description: ""
        },
        {
          name: "phoneArea",
          type: "'+86'",
          default: "'+86'",
          required: true,
          description: ""
        }
      ],
      emits: [],
    };
  },
};
