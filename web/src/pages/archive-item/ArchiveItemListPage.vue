<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card
            class="toggle"
            variant="flat"
            :class="{ active: showDrafts }"
            @click="showDrafts = !showDrafts"
          >
            <v-card-text class="d-flex">
              <span class="d-flex align-center me-3">
                <v-icon size="x-large">mdi-archive</v-icon>
              </span>

              <div>
                <div class="text-h6">My Submissions</div>
                <span class="text-subtitle-2 textSecondary font-weight-medium d-block"
                  >Items I Created</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="toggle"
            :class="{ active: showDue }"
            variant="flat"
            @click="showDue = !showDue"
          >
            <v-card-text class="d-flex">
              <span class="round-40 rounded-circle d-flex justify-center align-center me-3 icon">
                <v-icon
                  color="black"
                  size="x-large"
                  >mdi-archive-clock</v-icon
                >
              </span>

              <div>
                <div class="text-h6">Nearly Expired</div>
                <span class="text-subtitle-2 textSecondary font-weight-medium d-block"
                  >In the next 14 days</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="toggle"
            :class="{ active: showMine }"
            variant="flat"
            @click="showMine = !showMine"
          >
            <v-card-text class="d-flex">
              <span class="round-40 rounded-circle d-flex justify-center align-center me-3 icon">
                <v-icon
                  color="black"
                  size="x-large"
                  >mdi-archive-alert</v-icon
                >
              </span>

              <div>
                <div class="text-h6">Requires Attention</div>
                <span class="text-subtitle-2 textSecondary font-weight-medium d-block"
                  >Additional work required</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mb-3">
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="search"
            label="Search"
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="source"
            label="Source"
            density="compact"
          />
        </v-col>
        <v-col class="d-flex">
          <v-select
            v-model="status"
            label="Status"
            density="compact"
          />
          <v-btn
            class="ml-6"
            color="info"
            text="New Archive Item"
            style="height: 40px"
            :to="{ name: 'archive-item/ArchiveItemNewPage' }"
          />
        </v-col>
      </v-row>

      <v-data-table-server
        v-model:items-per-page="perPage"
        :page="page"
        :items="items"
        :items-length="totalCount"
        :loading="isLoading"
        :headers="headers"
        @update:page="updatePage"
        @click:row="openItem"
      >
        <template #item.calculatedExpireDate="{ item }">
          {{ formatDate(item.calculatedExpireDate) }}
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useArchiveItems from "@/use/use-archive-items"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import { ArchiveItem } from "@/api/archive-items-api"
import { formatDate } from "@/utils/formatters"

const router = useRouter()

const showDrafts = ref(false)
const showDue = ref(false)
const showMine = ref(false)

const search = ref()
const source = ref()
const status = ref()
const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })

const headers = [
  { title: "Title", value: "title" },
  { title: "Description", value: "description" },
  { title: "Status", value: "status" },
  { title: "Attachments", value: "archiveItemFileCount" },
  { title: "Expires On", value: "calculatedExpireDate" },
]

useBreadcrumbs("Archive Items", [BASE_CRUMB])

function updatePage(newPage: number) {
  if (isLoading.value) return
  page.value = newPage
}

const query = computed(() => {
  return { filters: { search: search.value }, page: page.value, perPage: perPage.value }
})

const { items, totalCount, isLoading } = useArchiveItems(query)

function openItem(_event: PointerEvent, { item }: { item: ArchiveItem }) {
  router.push({ name: "archive-item/ArchiveItemViewPage", params: { archiveItemId: item.id } })
}
</script>
