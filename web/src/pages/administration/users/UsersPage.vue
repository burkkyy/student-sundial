<template><UsersDataTableServer /></template>

<script setup lang="ts">
import useBreadcrumbs from "@/use/use-breadcrumbs"

//import UsersDataTableServer from "@/components/users/UsersDataTableServer.vue"

useBreadcrumbs("Users", [
  {
    title: "Administration",
    to: "/administration",
  },
])
</script>
