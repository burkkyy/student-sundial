<template>
  <v-select
    :items="items"
    item-value="id"
    item-title="name"
  />
</template>

<script setup lang="ts">
import useCategories from "@/use/use-categories"
import { onMounted } from "vue"

const { items, list } = useCategories()

onMounted(async () => {
  await list({ perPage: 1000, page: 1 })
})
</script>
