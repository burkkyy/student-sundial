<template>
  <v-select
    :items="items"
    item-value="id"
    :item-title="makeTitle"
  />
</template>

<script setup lang="ts">
import { Category } from "@/api/categories-api"
import useCategories from "@/use/use-categories"
import { onMounted } from "vue"

const { items, list } = useCategories()

onMounted(async () => {
  await list({ perPage: 1000, page: 1 })
})

function makeTitle(item: Category) {
  return `${item.name} (${item.retention?.name})`
}
</script>
