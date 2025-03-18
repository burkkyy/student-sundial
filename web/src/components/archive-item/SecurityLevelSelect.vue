<template><v-select :items="items" /></template>

<script setup lang="ts">
import { isNaN, capitalize } from "lodash"

import { SecurityLevel } from "@/api/archive-items-api"

const items = Object.keys(SecurityLevel)
  .filter((v) => !isNaN(parseInt(v)))
  .map((key) => {
    return { title: capitalize(SecurityLevel[parseInt(key)]), value: parseInt(key) }
  })
</script>
