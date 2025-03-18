<template>
  <CategoryForm :category-id="props.categoryId" />
</template>

<script setup lang="ts">
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import CategoryForm from "@/components/categories/CategoryForm.vue"

const props = defineProps<{
  categoryId: string
}>()

useBreadcrumbs("Edit Category", [
  ADMIN_CRUMB,
  {
    title: "Categories",
    to: {
      name: "administration/CategoryListPage",
    },
  },
])
</script>
