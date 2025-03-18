<template>
  <ArchiveItemNewForm />
</template>

<script setup lang="ts">
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import ArchiveItemNewForm from "../../components/archive-item/ArchiveItemNewForm.vue"

useBreadcrumbs("New Archive Item", [
  BASE_CRUMB,
  {
    title: "Archive Items",
    to: {
      name: "archive-item/ArchiveItemListPage",
    },
  },
])
</script>
