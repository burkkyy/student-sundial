<template>
  <v-row v-if="item">
    <v-col
      cols="12"
      md="8"
    >
      <v-card class="mb-5">
        <v-card-title>Archive Item Description</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="item.title"
                label="Title"
                readonly
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <SecurityLevelSelect
                v-model="item.securityLevel"
                label="Security level"
                readonly
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="item.description"
                label="Description"
                readonly
                rows="3"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Retention</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="item.retentionName"
                readonly
                label="Policy"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                :model-value="formatDate(item.calculatedExpireDate)"
                label="Expires on"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                :model-value="item.expireAction"
                label="When item expires"
                readonly
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Categories and Tags</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Categories and Tags are used as filter criteria to find items in the archive as well as
            determine who can see the items. You can select as many of each as are applicable to
            this item. Additional categories potentially increase the number of people that can see
            this information, but also make it more accessible in the future.
          </p>
          <v-select
            v-model="categoryNames"
            :hide-details="false"
            label="Categories"
            multiple
            chips
            readonly
          />
          <v-combobox
            v-model="item.tags"
            label="Tags"
            multiple
            chips
            readonly
          />
        </v-card-text>
      </v-card>

      <ArchiveItemAccessCard :item="item" />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-card
        class="mb-5"
        variant="tonal"
      >
        <v-card-title>
          <div class="text-subtitle-2 mb-n2 text-grey">RECORDED AT</div>
          {{ formatDateTime(item.createdAt) }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div v-if="item.sourceId">
            <div class="text-subtitle-2 mb-n1 text-grey">SOURCE</div>
            {{ item.source?.name }}
          </div>
          <div v-if="item.userId">
            <div class="text-subtitle-2 mb-n1 text-grey">RECORDED BY</div>
            {{ item.user?.displayName }}

            <p
              v-if="item.user?.title"
              class="mb-0"
            >
              {{ item.user?.title }}
            </p>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="mb-5">
        <v-card-title>Attachments</v-card-title>
        <v-card-text v-if="item.files && item.files.length > 0">
          <div
            v-for="file of item.files"
            :key="file.id"
          >
            <ArchiveItemFileCard
              :file="file"
              @reload-audit="reloadAudit"
            />
          </div>
        </v-card-text>
        <v-card-text v-else> No Attachments </v-card-text>
      </v-card>

      <ArchiveItemAuditCard
        ref="auditCard"
        :item-id="item.id"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import useArchiveItem from "@/use/use-archive-item"
import { formatDate, formatDateTime } from "@/utils/formatters"

import SecurityLevelSelect from "@/components/archive-item/SecurityLevelSelect.vue"
import ArchiveItemFileCard from "@/components/archive-item-files/ArchiveItemFileCard.vue"
import ArchiveItemAccessCard from "./ArchiveItemAccessCard.vue"
import ArchiveItemAuditCard from "./ArchiveItemAuditCard.vue"

const props = defineProps<{
  archiveItemId: string
}>()

const auditCard = ref<typeof ArchiveItemAuditCard>()
const archiveItemId = computed(() => (props.archiveItemId ? parseInt(props.archiveItemId) : null))

const { item } = useArchiveItem(archiveItemId)

const categoryNames = computed(() => {
  if (item.value && item.value.categories) {
    return item.value.categories.map((c) => c.name)
  }
  return []
})

function reloadAudit() {
  auditCard.value?.reload()
}
</script>
