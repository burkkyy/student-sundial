<template>
  <UserCreateForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import UserCreateForm from "@/components/users/UserCreateForm.vue"

useBreadcrumbs("New User", [
  ADMIN_CRUMB,
  {
    title: "Users",
    to: { name: "users/UsersPage" },
  },
])
</script>
