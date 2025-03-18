<template>
  <v-btn
    v-if="isSystemAdmin"
    :to="{ name: 'administration/SourceNewPage' }"
    style="height: 40px"
    >New Source</v-btn
  >
</template>

<script setup>
import useCurrentUser from "@/use/use-current-user"

const { isSystemAdmin } = useCurrentUser()
</script>
