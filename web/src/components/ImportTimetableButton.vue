<template>
  <div>
    <v-btn
      color="primary"
      variant="elevated"
      prepend-icon="mdi-import"
      text="Import Timetable"
      @click="triggerFileInput"
    />
    <input
      ref="fileInput"
      type="file"
      accept=".pdf"
      style="display: none"
      @change="handleFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import useSnack from "@/use/use-snack"

import timetableApi from "@/api/timetable-api"

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

const snack = useSnack()

async function handleFile(event: Event) {
  try {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]
      console.log("Selected file:", file)

      await timetableApi.upload(file)
      snack.success("Uploaded timetable")

      location.reload()
    }
  } catch (error) {
    snack.error(`Failed to create timetable: ${error}`)
  }
}
</script>
