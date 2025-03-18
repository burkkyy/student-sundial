<template>
  <RetentionForm :retention-id="props.retentionId" />
</template>

<script setup lang="ts">
import RetentionForm from "@/components/retentions/RetentionForm.vue"
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

const props = defineProps<{
  retentionId: string
}>()

useBreadcrumbs("Edit Retention", [
  ADMIN_CRUMB,
  {
    title: "Retentions",
    to: {
      name: "administration/RetentionListPage",
    },
  },
])
</script>
