<template>
  <v-app>
    <v-app-bar
      height="64"
      class="horizontal-header"
      color="header-bar-color"
      elevation="0"
    >
      <!---Logo part -->
      <div class="v-toolbar__content px-6">
        <div class="logo">
          <RouterLink to="/">
            <img
              src="@/assets/logo.webp"
              alt="logo"
              class="mt-1"
              style="height: 40px"
          /></RouterLink>
        </div>

        <v-spacer />
        <GoogleCalenderSyncButton class="mr-5" />
        <ImportTimetableButton class="mr-5" />
        <v-menu
          bottom
          offset-y
          transition="scale-transition"
        >
          <template #activator="{ props }">
            <v-btn
              color="white"
              variant="tonal"
              icon
              v-bind="props"
              class="mr-1"
              style="border: none"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list class="">
            <v-list-item>
              <template #prepend>
                <v-icon color="header-bar-color">mdi-account</v-icon>
              </template>
              <v-list-item-title class="">{{ currentUser.displayName }}</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item
              v-if="isSystemAdmin"
              to="/administration"
            >
              <template #prepend>
                <v-icon color="header-bar-color">mdi-cog</v-icon>
              </template>
              <v-list-item-title class="text-right"> Administration </v-list-item-title>
            </v-list-item>

            <v-list-item
              class="text-right"
              @click="logoutWrapper"
            >
              <template #prepend> <v-icon color="header-bar-color">mdi-exit-run</v-icon> </template
              >Sign out</v-list-item
            >
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <AppBreadcrumbs />
      <v-container
        fluid
        class="page-wrapper pb-sm-15 pb-10"
      >
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"

import { useAuth0 } from "@auth0/auth0-vue"
import useCurrentUser from "@/use/use-current-user"

import AppBreadcrumbs from "@/components/common/AppBreadcrumbs.vue"
import ImportTimetableButton from "@/components/ImportTimetableButton.vue"
import GoogleCalenderSyncButton from "@/components/GoogleCalenderSyncButton.vue"

const { currentUser, isSystemAdmin } = useCurrentUser<true>()
const { logout } = useAuth0()

async function logoutWrapper() {
  await logout({
    logoutParams: {
      // I would prefer to redirect to /sign-in here, but that doesn't seem to work?
      returnTo: window.location.origin,
    },
  })
}
</script>
