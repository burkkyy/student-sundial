<template>
  <v-select
    :items="items"
    item-value="id"
    item-title="name"
  />
</template>

<script setup lang="ts">
import useRetentions from "@/use/use-retentions"
import { onMounted } from "vue"

const { items, list } = useRetentions()

onMounted(async () => {
  await list({ perPage: 1000, page: 1 })
})
</script>
