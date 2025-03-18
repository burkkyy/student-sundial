<template>
  <RetentionForm :retention-id="retentionId" />
</template>

<script setup lang="ts">
import { ref } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import RetentionForm from "@/components/retentions/RetentionForm.vue"

const retentionId = ref(null)

useBreadcrumbs("New Retention", [
  ADMIN_CRUMB,
  {
    title: "Retentions",
    to: {
      name: "administration/RetentionListPage",
    },
  },
])
</script>
