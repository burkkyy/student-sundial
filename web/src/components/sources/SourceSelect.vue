<template>
  <v-select
    :items="items"
    item-value="id"
    item-title="name"
  />
</template>

<script setup lang="ts">
import useSources from "@/use/use-sources"
import { onMounted } from "vue"

const { items, list } = useSources()

onMounted(async () => {
  await list({ perPage: 1000, page: 1 })
})
</script>
