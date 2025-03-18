import archiveItemsApi, { ArchiveItemFile } from "@/api/archive-items-api"
import { isNil } from "lodash"
import { reactive, toRefs } from "vue"
import useSnack from "@/use/use-snack"

const snack = useSnack()

// Global state for preview
const state = reactive<{
  showDialog: boolean
  isLoading: boolean
  previewBlob?: Blob | null
  title?: string | null
  file?: ArchiveItemFile | null
  usePdf: boolean
}>({
  isLoading: false,
  showDialog: false,
  previewBlob: undefined,
  title: null,
  usePdf: false,
})

export function usePdfPreview() {
  function canPreview(mimeType: string | null): boolean {
    if (isNil(mimeType) || mimeType.length == 0) return false

    if (mimeType.includes("pdf")) return true
    if (mimeType.includes("image")) return true

    console.log("checking canPreview", mimeType)
    return false
  }

  async function showPreview(file: ArchiveItemFile, usePdf: boolean = false) {
    if (!file.archiveItemId) return
    state.isLoading = true
    state.title = (usePdf ? file.pdfFileName : file.originalFileName) ?? "Preview"
    state.file = file
    state.usePdf = usePdf
    state.showDialog = true

    const result = await archiveItemsApi
      .download(file.archiveItemId, file.id, usePdf)
      .then((resp) => resp)
      .catch(() => {})

    if (!result) {
      snack.error("Failed to load preview")
    } else {
      const newBlob = new Blob([result], {
        type: usePdf ? "application/pdf" : file.originalMimeType,
      })
      state.previewBlob = newBlob
    }
    state.isLoading = false
  }

  function hidePreview() {
    state.showDialog = false
    state.previewBlob = null
    state.title = null
    state.file = null
    state.usePdf = false
  }

  function previewType(mimeType: string | null): string {
    if (isNil(mimeType) || mimeType.length == 0) return "Unknown"

    if (mimeType.includes("pdf")) {
      return "PDF"
    }
    if (mimeType.includes("image")) {
      return "Image"
    }

    return "Unknown"
  }

  return {
    ...toRefs(state),
    canPreview,
    showPreview,
    hidePreview,
    previewType,
  }
}

export default usePdfPreview
