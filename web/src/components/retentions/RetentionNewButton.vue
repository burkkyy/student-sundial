<template>
  <v-btn
    v-if="isSystemAdmin"
    :to="{ name: 'administration/RetentionNewPage' }"
    style="height: 40px"
    >New Retention</v-btn
  >
</template>

<script setup>
import useCurrentUser from "@/use/use-current-user"

const { isSystemAdmin } = useCurrentUser()
</script>
