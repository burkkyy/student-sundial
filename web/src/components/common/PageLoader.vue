<template>
  <div class="d-flex justify-center align-center h-screen">
    <div class="d-flex flex-column align-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="mb-5"
        color="yg-blue"
      ></v-progress-circular>
      <h1>{{ message }}</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    default: "Loading ...",
  },
})
</script>
