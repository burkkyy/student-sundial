<template>
  <v-row>
    <v-col
      cols="12"
      md="9"
    >
      <TabCard :tabs="tabs">
        <v-tabs-window-item :value="0">
          <div class="mt-2 ml-1">
            <router-link to="/courses">View all Courses</router-link>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item :value="1">
          <div class="mt-2 ml-1">
            <router-link to="/courses">View all Courses Events</router-link>
          </div></v-tabs-window-item
        >
      </TabCard>
    </v-col>
    <v-col
      cols="12"
      md="3"
    >
      <SimpleCard
        title="Upcoming Deadlines"
        color="error"
      >
        <ul class="ml-5">
          <li>List of next 5 items coming due</li>
          <li>Calendar view of next 30 days</li>
        </ul>
      </SimpleCard>

      <SimpleCard
        title="Statistics"
        color="success"
      >
        <ul class="ml-5">
          <li>Pie charts by status</li>
          <li>Milestone cashflow by Month</li>
          <li>Breakdowns by business unit</li>
        </ul>
      </SimpleCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue"

import SimpleCard from "@/components/common/SimpleCard.vue"
import TabCard from "@/components/common/TabCard.vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Dashboard", [])

const tabs = ref([
  { value: 0, title: "Open Courses", icon: "mdi-folder-question" },
  { value: 1, title: "Open Courses events", icon: "mdi-folder-check" },
])
</script>
