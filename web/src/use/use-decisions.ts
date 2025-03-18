import decisionsApi, {
  Decision,
  DecisionFiltersOptions,
  DecisionWhereOptions,
} from "@/api/decisions-api"
import { reactive, toRefs } from "vue"

// Global state for breadcrumbs
const state = reactive<{
  items: Decision[]
  totalCount: number
  isLoading: boolean
  isErrored: boolean
}>({
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
})

export function useDecisions() {
  // state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]

  async function list(
    params: {
      where?: DecisionWhereOptions
      filters?: DecisionFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<void> {
    state.isLoading = true
    try {
      const { decisions, totalCount } = await decisionsApi.list(params)
      state.isErrored = false
      state.items = decisions
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

export default useDecisions
