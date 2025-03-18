<template>
  <v-card>
    <v-card-title>Users with Access to this Item</v-card-title>
    <v-card-text v-if="!isNil(item.permittedUsers) && item.permittedUsers.length > 0">
      <v-list
        class="py-0"
        style="border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 4px"
      >
        <v-list-item
          v-for="(user, idx) of item.permittedUsers"
          :key="user.id"
          :title="`${user.displayName} : ${user.email}`"
          :subtitle="`${user.department ?? 'Unknown department'} - ${user.title ?? 'Unknown title'}`"
          class="py-2"
          :class="{ 'border-bottom': idx < item.permittedUsers.length - 1 }"
        >
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-else>No users have access to this item</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"

import { ArchiveItem } from "@/api/archive-items-api"

defineProps<{ item: ArchiveItem }>()
</script>
<style>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
