<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          class="mb-4 mr-5"
          label="Search"
          density="compact"
        />
        <RetentionNewButton />
      </div>

      <v-data-table-server
        v-model:items-per-page="perPage"
        :search="search"
        :items="items"
        :items-length="totalCount"
        :page="page"
        :loading="isLoading"
        :headers="headers"
        @update:options="loadItems"
        @click:row="openItem"
      ></v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useRetentions from "@/use/use-retentions"
import { Retention } from "@/api/retentions-api"

import RetentionNewButton from "@/components/retentions/RetentionNewButton.vue"

const router = useRouter()

const { isLoading, items, totalCount, list } = useRetentions()

onMounted(async () => {
  if (!isLoading.value) await loadItems()
})

const search = ref()
const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })

const headers = [
  { title: "Name", value: "name" },
  { title: "Schedule", value: "expireSchedule" },
  { title: "Action", value: "expireAction" },
  { title: "Default", value: "isDefault" },
]

useBreadcrumbs("Retentions", [ADMIN_CRUMB])

async function loadItems() {
  list({ filters: { search: search.value }, page: page.value, perPage: perPage.value })
}
function openItem(_event: PointerEvent, { item }: { item: Retention }) {
  router.push({ name: "administration/RetentionEditPage", params: { retentionId: item.id } })
}
</script>
