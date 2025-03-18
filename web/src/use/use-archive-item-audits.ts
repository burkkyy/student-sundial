import archiveItemAuditsApi, {
  ArchiveItemAudit,
  ArchiveItemAuditFiltersOptions,
  ArchiveItemAuditWhereOptions,
} from "@/api/archive-item-audits-api"
import { reactive, ref, Ref, toRefs, unref, watch } from "vue"

export function useArchiveItemAudits(
  archiveItemId: number,
  queryOptions: Ref<{
    where?: ArchiveItemAuditWhereOptions
    filters?: ArchiveItemAuditFiltersOptions
    page?: number
    perPage?: number
  }> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    items: ArchiveItemAudit[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    items: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ArchiveItemAudit[]> {
    state.isLoading = true
    try {
      const { archiveItemAudits, totalCount } = await archiveItemAuditsApi.list(
        archiveItemId,
        unref(queryOptions)
      )
      state.isErrored = false
      state.items = archiveItemAudits
      state.totalCount = totalCount
      return archiveItemAudits
    } catch (error) {
      console.error("Failed to fetch status:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }
  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return
      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
  }
}

export default useArchiveItemAudits
