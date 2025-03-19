<template>
  <v-card
    class="mb-5 simple-card"
    color="#F0F4EA"
  >
    <v-tabs
      v-model="activeTab"
      bg-color="white"
      color="success"
      stacked
      grow
      :items="tabs"
      density="comfortable"
    >
      <v-tab
        v-for="tab of tabs"
        :key="tab.value"
        :value="tab.value"
      >
        <v-icon :icon="tab.icon"></v-icon>{{ tab.title }}</v-tab
      >
    </v-tabs>
    <v-divider />

    <v-card-text>
      <v-tabs-window v-model="activeTab">
        <slot></slot>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  tabs: { value: number; title: string; icon: string }[]
  defaultTab?: number
}>()

const activeTab = ref(props.defaultTab ?? 0)
</script>
