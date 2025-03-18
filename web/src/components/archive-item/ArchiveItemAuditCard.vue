<template>
  <v-card :loading="isLoading">
    <v-card-title
      >Audit History
      <small>
        ({{ page * perPage - perPage + 1 }} - {{ Math.min(totalCount, page * perPage) }} of
        {{ totalCount }})
      </small>
    </v-card-title>
    <v-card-text v-if="!isNil(items) && items.length > 0">
      <v-list
        class="py-0"
        style="border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 4px"
      >
        <v-list-item
          v-for="(audit, idx) of items"
          :key="audit.id"
          :title="formatDateTime(audit.createdAt)"
          :subtitle="makeSubtitle(audit)"
          class="py-2"
          :class="{ 'border-bottom': idx < items.length - 1 }"
        >
          {{ audit.action }}
        </v-list-item>
      </v-list>

      <v-pagination
        v-model="page"
        density="compact"
        :length="pageCount"
      />
    </v-card-text>
    <v-card-text v-else>No audit history</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isNil } from "lodash"

import useArchiveItemAudits from "@/use/use-archive-item-audits"
import { formatDateTime } from "@/utils/formatters"
import { ArchiveItemAudit } from "@/api/archive-item-audits-api"

const props = defineProps<{ itemId: number }>()
const archiveItemId = computed(() => props.itemId)

defineExpose({ reload })

const page = ref(1)
const perPage = ref(3)
const pageCount = computed(() => Math.ceil(totalCount.value / perPage.value))

const query = computed(() => {
  return { filters: {}, page: page.value, perPage: perPage.value }
})

const { items, totalCount, isLoading, fetch } = useArchiveItemAudits(archiveItemId.value, query)

function makeSubtitle(item: ArchiveItemAudit): string {
  if (item.user) {
    return `${item.user?.displayName} - ${item.user?.department ?? "Unknown department"}`
  }
  return item.description ?? ""
}

function reload() {
  page.value = 1
  fetch()
}
</script>

<style>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
