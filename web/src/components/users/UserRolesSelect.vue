<template>
  <v-select
    v-model="selectedRoles"
    :items="roleItems"
    label="Roles"
    chips
    multiple
    closable-chips
    v-bind="$attrs"
  ></v-select>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"

import { UserRoles } from "@/api/users-api"

const selectedRoles = defineModel<UserRoles[]>({
  default: [],
})

const { t } = useI18n()

const ORDERED_ROLES = [UserRoles.USER, UserRoles.SYSTEM_ADMIN]

const roleItems = Object.values(ORDERED_ROLES).map((value) => ({
  title: t(`user.roles.${value}`),
  value,
}))
</script>
