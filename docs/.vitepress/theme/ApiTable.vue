<script setup lang="ts">
defineProps<{
  headers: string[];
  items: Record<string, any>[];
  cols: string[];
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="h in headers" :key="h">{{ h }}</th>
      </tr>
    </thead>
    <tr v-for="(item, i) in items" :key="i">
      <td v-for="col in cols" :key="col">{{ item[col] }}</td>
    </tr>
  </table>
</template>
