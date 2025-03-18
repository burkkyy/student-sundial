<template>
  <SourceForm :source-id="sourceId" />
</template>

<script setup lang="ts">
import { ref } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import SourceForm from "@/components/sources/SourceForm.vue"

const sourceId = ref(null)

useBreadcrumbs("New Source", [
  ADMIN_CRUMB,
  {
    title: "Sources",
    to: {
      name: "administration/SourceListPage",
    },
  },
])
</script>
