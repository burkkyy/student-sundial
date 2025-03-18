<template>
  <v-card>
    <v-card-text>

      <UsersEditTable />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import UsersEditTable from "@/components/users/UsersEditTable.vue"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"

useBreadcrumbs("Users", [ADMIN_CRUMB])
</script>
