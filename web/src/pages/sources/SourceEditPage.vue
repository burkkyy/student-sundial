<template>
  <SourceForm :source-id="props.sourceId" />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import SourceForm from "@/components/sources/SourceForm.vue"

const props = defineProps<{
  sourceId: string
}>()

useBreadcrumbs("Edit Source", [
  ADMIN_CRUMB,
  {
    title: "Sources",
    to: {
      name: "administration/SourceListPage",
    },
  },
])
</script>
