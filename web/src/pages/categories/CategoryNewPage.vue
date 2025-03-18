<template>
  <CategoryForm :category-id="categoryId" />
</template>

<script setup lang="ts">
import { ref } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import CategoryForm from "@/components/categories/CategoryForm.vue"

const categoryId = ref(null)

useBreadcrumbs("New Category", [
  ADMIN_CRUMB,
  {
    title: "Categories",
    to: {
      name: "administration/CategoryListPage",
    },
  },
])
</script>
