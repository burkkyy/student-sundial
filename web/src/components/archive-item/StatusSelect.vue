<template>
  <v-select :items="items" />
</template>

<script setup lang="ts">
import { isNaN, capitalize } from "lodash"

import { ArchiveItemStatus } from "@/api/archive-items-api"

const items = Object.keys(ArchiveItemStatus)
  .filter((v) => isNaN(parseInt(v)))
  .map((v) => capitalize(v))
</script>
