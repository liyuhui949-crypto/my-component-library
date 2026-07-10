<!--
 * @Author: 李玉辉
 * @Date: 2026-07-10 15:21:17
 * @LastEditTime: 2026-07-10 15:49:47
 * @LastEditors: 李玉辉
 * @Description: 
-->
<script lang="ts" setup generic="T extends Record<string, any>">
import { obtainPreciseType } from "@/utils/obtainPreciseType";

defineOptions({
  name: "UtilsTest",
});

const a = null;
const b = undefined;
const c = { name: "John", age: 30 };
const d = [1, 2, 3];
const e = NaN;
const f = Boolean(0);
console.log(a, obtainPreciseType(a)); // 输出: "null"
console.log(b, obtainPreciseType(b)); // 输出: "undefined"
console.log(c, obtainPreciseType(c)); // 输出: "object"
console.log(d, obtainPreciseType(d)); // 输出: "array"
console.log(e, obtainPreciseType(e)); // 输出: "number"
console.log(f, obtainPreciseType(f)); // 输出: "boolean"
</script>

<template>
  <div>utils测试</div>
</template>
