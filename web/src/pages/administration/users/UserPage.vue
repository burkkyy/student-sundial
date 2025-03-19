<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <v-card
    v-else
    elevation="3"
    class="mt-5"
  >
    <v-list-item>
      <template #title>
        <v-card-title>Edit User</v-card-title>
      </template>
      <template #append>
        <v-btn
          color="error"
          :to="{
            name: 'administration/users/UsersPage',
          }"
          text="Go Back"
        />
      </template>
    </v-list-item>
    <v-card-text>
      <UserEditForm :user-id="userId" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, watch } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useUser from "@/use/use-user"
// import UserEditForm from "@/components/users/UserEditForm.vue"

const props = defineProps<{ userId: string }>()
const userIdNumber = computed(() => parseInt(props.userId))
const { user, isLoading } = useUser(userIdNumber)

watch(isLoading, () => {
  useBreadcrumbs("User Edit", [
    {
      title: "Administration",
      to: "/administration",
    },
    {
      title: "Users",
      to: "/administration/users",
    },
    {
      title: `${user.value?.firstName} ${user.value?.lastName}`,
      to: "",
    },
  ])
})
</script>
