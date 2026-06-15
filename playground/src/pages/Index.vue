<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 获取所有已注册的路由，过滤掉通配符路由
const routes = router.getRoutes().filter(
  (route) => !route.path.includes(':pathMatch')
)
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mt-8">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-routes</v-icon>
            已注册路由列表
          </v-card-title>

          <v-divider />

          <v-list lines="one">
            <v-list-item
              v-for="route in routes"
              :key="route.name"
              :to="route.path"
              prepend-icon="mdi-arrow-right-bold-circle-outline"
              :title="route.name?.toString() || route.path"
              :subtitle="route.path"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
