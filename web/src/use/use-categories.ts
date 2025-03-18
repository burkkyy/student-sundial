import categoriesApi, {
  Category,
  CategoryFiltersOptions,
  CategoryWhereOptions,
} from "@/api/categories-api"
import { reactive, toRefs } from "vue"

// Global state for breadcrumbs
const state = reactive<{
  items: Category[]
  totalCount: number
  isLoading: boolean
  isErrored: boolean
}>({
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
})

export function useCategories() {
  // state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]

  async function list(
    params: {
      where?: CategoryWhereOptions
      filters?: CategoryFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<void> {
    state.isLoading = true
    try {
      const { categories, totalCount } = await categoriesApi.list(params)
      state.isErrored = false
      state.items = categories
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

export default useCategories
