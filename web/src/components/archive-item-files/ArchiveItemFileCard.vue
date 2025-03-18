<template>
  <v-card
    class="bg-secondary mb-4"
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-card-title
      style="font-weight: 400; font-size: 16px"
      :title="file.originalFileName"
    >
      {{ file.originalFileName }}
    </v-card-title>
    <v-divider />

    <v-card-text class="pa-2">
      <div class="d-block d-lg-flex">
        <v-icon
          class="mr-2"
          color="primary"
          size="40"
          :icon="getFileIcon(file.originalMimeType)"
        />
        <p>
          <span style="font-size: 16px">Original Format</span><br />
          {{ formatBytes(file.originalFileSize) }}
        </p>
        <v-spacer />
        <div class="flex-grow-1 mt-2 text-lg-right mr-0 mt-lg-n2 mb-lg-n2">
          <v-btn
            class="py-0"
            variant="text"
            size="small"
            :disabled="!canPreview(file.originalMimeType)"
            @click="previewFile()"
            >Preview</v-btn
          >
          <br v-if="lgAndUp" />

          <v-btn
            class="py-0"
            variant="text"
            size="small"
            @click="downloadFile()"
            >Download</v-btn
          >
        </div>
      </div>
    </v-card-text>
    <v-divider v-if="file.pdfKey" />
    <v-card-text
      v-if="file.pdfKey"
      class="pa-2"
    >
      <div class="d-block d-lg-flex">
        <v-icon
          class="mr-2"
          color="primary"
          size="40"
          icon="mdi-shield-check"
        />
        <p>
          <span style="font-size: 16px">Protected PDF</span><br />
          {{ formatBytes(file.pdfFileSize ?? 0) }}
        </p>
        <v-spacer />
        <div class="flex-grow-1 mt-2 text-lg-right mr-0 mt-lg-n2 mb-lg-n2">
          <v-btn
            class="py-0"
            variant="text"
            size="small"
            :disabled="!canPreview(file.pdfMimeType)"
            @click="previewFile(true)"
            >Preview</v-btn
          >
          <br v-if="lgAndUp" />

          <v-btn
            class="py-0"
            variant="text"
            size="small"
            @click="downloadFile(true)"
            >Download</v-btn
          >
        </div>
      </div>
    </v-card-text>
    <v-divider
      v-if="file.comment"
      class="my-2"
    />
    <div
      v-if="file.comment"
      class="text-black pt-1 pa-4"
    >
      {{ file.comment }}This file is really impoerant and shoudl be reviewed by the team daily until
      the understand the ramifications of it's importantance to the organizations
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

import archiveItemsApi, { ArchiveItemFile } from "@/api/archive-items-api"
import { getFileIcon } from "@/utils/file-icons"
import { formatBytes } from "@/utils/formatters"
import { useDisplay } from "vuetify"
import usePreview from "@/use/use-preview"

const { lgAndUp } = useDisplay()
const { canPreview, showPreview } = usePreview()
const emit = defineEmits(["reloadAudit"])
const isLoading = ref(false)

const props = defineProps<{
  file: ArchiveItemFile
}>()

async function downloadFile(usePDF: boolean = false) {
  if (!props.file.archiveItemId) return

  const result = await archiveItemsApi.download(props.file.archiveItemId, props.file.id, usePDF)
  const newBlob = new Blob([result])
  const objUrl = window.URL.createObjectURL(newBlob)
  const link = document.createElement("a")
  link.href = objUrl
  link.download = (usePDF ? props.file.pdfFileName : props.file.originalFileName) || "download"
  link.click()

  emit("reloadAudit")
}

async function previewFile(usePdf: boolean = false) {
  await showPreview(props.file, usePdf)
  emit("reloadAudit")
}
</script>
