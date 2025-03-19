<template>
  <v-app>
    <router-view v-if="isReadyCurrentUser" />
    <PageLoader v-else />
  </v-app>
  <AppSnackbar />
</template>

<script setup lang="ts">
import { watch } from "vue"

import useCurrentUser from "@/use/use-current-user"
import PageLoader from "@/components/PageLoader.vue"
import AppSnackbar from "@/components/AppSnackbar.vue"

const { isReady: isReadyCurrentUser, ensure } = useCurrentUser<true>()

watch(
  () => isReadyCurrentUser.value,
  async (newIsReadyCurrentUser) => {
    if (newIsReadyCurrentUser === true) {
      try {
        await ensure()
      } catch (error) {
        console.log("Failed to ensure current user:", error)
      }
    }
  },
  { immediate: true }
)
</script>
