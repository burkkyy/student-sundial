import archiveItemsApi, {
  ArchiveItem,
  ArchiveItemFiltersOptions,
  ArchiveItemWhereOptions,
} from "@/api/archive-items-api"
import { reactive, ref, Ref, toRefs, unref, watch } from "vue"

export function useArchiveItems(
  queryOptions: Ref<{
    where?: ArchiveItemWhereOptions
    filters?: ArchiveItemFiltersOptions
    page?: number
    perPage?: number
  }> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    items: ArchiveItem[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    items: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ArchiveItem[]> {
    state.isLoading = true
    try {
      const { archiveItems, totalCount } = await archiveItemsApi.list(unref(queryOptions))
      state.isErrored = false
      state.items = archiveItems
      state.totalCount = totalCount
      return archiveItems
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

export default useArchiveItems
