<template>
  <v-app>
    <router-view v-if="isUnauthenticatedRoute"></router-view>
    <router-view v-else-if="isReady || isErrored" />
    <PageLoader
      v-else-if="isReadyAuth0 && isLoadingCurrentUser"
      message="Fetching and syncing user"
    />
    <PageLoader
      v-else-if="isLoadingAuth0"
      message="Checking authentication status ..."
    />
    <PageLoader
      v-else
      message="Initializing app ..."
    />
    <AppSnackbar />
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { useRoute, useRouter } from "vue-router"

import useCurrentUser from "@/use/use-current-user"

import PageLoader from "@/components/common/PageLoader.vue"
import AppSnackbar from "@/components/common/AppSnackbar.vue"

const route = useRoute()
const isUnauthenticatedRoute = computed(() => route.meta.requiresAuth === false)

const { isLoading: isLoadingAuth0, isAuthenticated } = useAuth0()
const isReadyAuth0 = computed(() => !isLoadingAuth0.value && isAuthenticated.value)

const { isReady: isReadyCurrentUser, isLoading: isLoadingCurrentUser, fetch } = useCurrentUser()

const isReady = computed(() => isReadyAuth0.value && isReadyCurrentUser.value)

const isErrored = ref(false)
const router = useRouter()

watch(
  () => isReadyAuth0.value,
  async (newIsReadyAuth0) => {
    if (isUnauthenticatedRoute.value) return

    if (newIsReadyAuth0 === true) {
      try {
        await fetch()
      } catch (error) {
        console.log("Failed to load current user:", error)
        isErrored.value = true
        await router.isReady()
        await router.push({ name: "UnauthorizedPage" })
      }
    }
  },
  { immediate: true }
)
</script>
