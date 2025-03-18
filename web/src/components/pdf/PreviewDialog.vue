<template>
  <v-dialog
    v-model="showDialog"
    :max-width="fullscreen ? '100%' : 800"
    persistent
  >
    <v-card
      :loading="isLoading"
      :disabled="isLoading"
    >
      <v-card-title class="d-flex">
        {{ title }}
        <v-spacer />
        <v-btn
          :disabled="isLoading"
          prepend-icon="mdi-download"
          size="small"
          class="mr-6"
          style="height: 32px"
          @click="downloadClick"
          >Download</v-btn
        >
        <v-btn
          :icon="fullscreen ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'"
          size="x-small"
          class="mr-3"
          variant="flat"
          title="Toggle Fullscreen"
          @click="fullscreen = !fullscreen"
        ></v-btn>
        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="flat"
          title="Close"
          @click="hide"
        ></v-btn>
      </v-card-title>
      <v-card-text
        class="pa-2"
        style="min-height: 200px"
      >
        <div
          v-if="isLoading"
          class="text-center"
        >
          Loading...
        </div>
        <pdf
          v-if="previewUrl && isPdfPreview"
          :source="previewUrl"
          :width="previewWidth"
          style="border: 1px black solid; margin-right: 10px; width: 100%; height: 100%"
        />
        <img
          v-else-if="previewUrl && isImagePreview"
          :src="previewUrl"
          style="border: 1px black solid; margin-right: 10px; width: 100%; height: 100%"
        />
        <div v-else-if="!isLoading">
          Sorry, no preview available, use download button to download the file.
        </div>
      </v-card-text>
      <div class="d-none">PREVIEW_URL: {{ previewUrl }}</div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useDisplay } from "vuetify/lib/framework.mjs"
import Pdf from "vue-pdf-embed"

import usePreview from "@/use/use-preview"
import archiveItemsApi from "@/api/archive-items-api"

const { previewBlob, title, usePdf, showDialog, isLoading, file, hidePreview } = usePreview()

const fullscreen = ref(false)
const { width } = useDisplay()
const previewWidth = computed(() => {
  return fullscreen.value ? width.value - 96 : 766
})

const previewUrl = ref<string | null>(null)

watch(
  () => [previewBlob?.value, showDialog.value],
  ([blob, show]) => {
    if (blob && show) {
      previewUrl.value = URL.createObjectURL(blob as Blob)
    } else if (!show) {
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    console.log("PREVIEW_URL", show, previewUrl.value)
  }
)

const isPdfPreview = computed(() => {
  return (usePdf.value === true || file?.value?.originalMimeType.includes("pdf")) ?? false
})

const isImagePreview = computed(() => {
  return (usePdf.value === false && file?.value?.originalMimeType.includes("image")) ?? false
})

async function downloadClick() {
  if (!file?.value?.archiveItemId || !previewUrl.value) return

  const result = await archiveItemsApi.download(
    file.value.archiveItemId,
    file.value.id,
    usePdf.value
  )
  const newBlob = new Blob([result])
  const objUrl = window.URL.createObjectURL(newBlob)
  const link = document.createElement("a")
  link.href = objUrl
  link.download =
    (usePdf.value ? file.value.pdfFileName : file.value.originalFileName) || "download"
  link.click()
}

function hide() {
  hidePreview()
}
</script>
