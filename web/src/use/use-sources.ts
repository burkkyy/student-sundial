import sourcesApi, { Source, SourceFiltersOptions, SourceWhereOptions } from "@/api/sources-api"
import { reactive, toRefs } from "vue"

// Global state for breadcrumbs
const state = reactive<{
  items: Source[]
  totalCount: number
  isLoading: boolean
  isErrored: boolean
}>({
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
})

export function useSources() {
  // state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]

  async function list(
    params: {
      where?: SourceWhereOptions
      filters?: SourceFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<void> {
    state.isLoading = true
    try {
      const { sources, totalCount } = await sourcesApi.list(params)
      state.isErrored = false
      state.items = sources
      state.totalCount = totalCount
    } catch (error) {
      console.error("Failed to fetch status:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  return {
    ...toRefs(state),
    list,
  }
}

export default useSources
