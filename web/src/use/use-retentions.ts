import retentionsApi, {
  Retention,
  RetentionWhereOptions,
  RetentionFiltersOptions,
} from "@/api/retentions-api"
import { reactive, toRefs } from "vue"

// Global state for breadcrumbs
const state = reactive<{
  items: Retention[]
  totalCount: number
  isLoading: boolean
  isErrored: boolean
}>({
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
})

export function useRetentions() {
  // state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]

  async function list(
    params: {
      where?: RetentionWhereOptions
      filters?: RetentionFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<void> {
    state.isLoading = true
    try {
      const { retentions, totalCount } = await retentionsApi.list(params)
      state.isErrored = false
      state.items = retentions
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

export default useRetentions
