<template>
  <DecisionViewForm :decision-id="props.decisionId" />
</template>

<script setup lang="ts">
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import DecisionViewForm from "@/components/decisions/DecisionViewForm.vue"

const props = defineProps<{
  decisionId: string
}>()

useBreadcrumbs("View Decision", [
  BASE_CRUMB,
  {
    title: "Decisions",
    to: {
      name: "decisions/DecisionListPage",
    },
  },
])
</script>
