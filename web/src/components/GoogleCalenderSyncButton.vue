<template>
  <div>
    <v-btn
      color="success"
      variant="elevated"
      prepend-icon="mdi-export"
      text="Sync with google calendar"
      @click="syncGoogleCalendar"
    />
  </div>
</template>

<script setup lang="ts">
import useSnack from "@/use/use-snack"

import googleCalendarApi from "@/api/google-calendar-api"

const snack = useSnack()

async function syncGoogleCalendar() {
  try {
    googleCalendarApi.uploadTimeTable()
    snack.success("Sync timetable with google calendar")
  } catch (error) {
    snack.error(`Failed to create timetable: ${error}`)
  }
}
</script>
