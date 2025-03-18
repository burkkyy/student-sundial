<template>
  <v-skeleton-loader v-if="isNil(currentUser)" />
  <v-container v-else>
    <div class="d-flex flex-column flex-md-row justify-space-between mb-3">
      <v-spacer />
      <div class="d-flex justify-space-between mt-4 mb-3 my-md-0">
        <v-btn
          color="primary"
          variant="outlined"
          :to="{ name: 'users/UsersPage' }"
        >
          Back
        </v-btn>
        <v-btn
          class="ml-md-3"
          title="Refresh"
          color="primary"
          append-icon="mdi-sync"
          @click="refresh"
        >
          Sync
        </v-btn>
      </div>
    </div>

    <UserEditForm
      class="mt-10"
      :user-id="currentUser.id"
      :cancel-button-options="{ to: { name: 'users/UsersPage' } }"
      @saved="refresh"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import UserEditForm from "@/components/users/UserEditForm.vue"

const { currentUser, refresh } = useCurrentUser<true>()

useBreadcrumbs("My Profile")
</script>

<style scoped></style>
