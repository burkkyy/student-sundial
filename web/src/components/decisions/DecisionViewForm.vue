<template>
  <v-row v-if="item">
    <v-col
      cols="12"
      md="8"
    >
      <h2 class="mb-3">Background Information</h2>
      <v-card class="mb-5">
        <v-card-title>Description</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="item.title"
                label="Title"
                readonly
              ></v-text-field>
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
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="categoryNames"
                label="Categories"
                multiple
                chips
                readonly
              />
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="item.tags"
                label="Tags"
                readonly
                multiple
                chips
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <h2 class="mb-3">Decision</h2>
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
          <div v-if="item.sourceId"></div>
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
          <v-btn
            color="info"
            class="mt-5"
            readonly
            block
            >{{ item.decisionText }}</v-btn
          >
        </v-card-text>
      </v-card>

      <v-card class="mb-5">
        <v-card-title>Attachments</v-card-title>
        <v-card-text v-if="item.files && item.files.length > 0">
          <div
            v-for="file of item.files"
            :key="file.id"
          >
            <ArchiveItemFileCard :file="file" />
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
import { computed } from "vue"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useDecision from "@/use/use-decision"
import { formatDate, formatDateTime } from "@/utils/formatters"
import ArchiveItemAuditCard from "../archive-item/ArchiveItemAuditCard.vue"

const props = defineProps<{
  decisionId: string
}>()

const decisionId = computed(() => (props.decisionId ? parseInt(props.decisionId) : null))
const { item } = useDecision(decisionId)

const categoryNames = computed(() => {
  if (item.value && item.value.categories) {
    return item.value.categories.map((c) => c.name)
  }
  return []
})

useBreadcrumbs("Decision Record", [
  BASE_CRUMB,
  { title: "Decisions", to: { name: "decisions/DecisionListPage" } },
])
</script>
