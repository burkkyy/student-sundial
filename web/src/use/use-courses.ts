import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import coursesApi, {
  type Course,
  type CourseWhereOptions,
  type CourseQueryOptions,
} from "@/api/courses-api"

export { type Course, type CourseWhereOptions, type CourseQueryOptions }

export function useCourses(
  queryOptions: Ref<CourseQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    courses: Course[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    courses: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Course[]> {
    state.isLoading = true
    try {
      const { courses, totalCount } = await coursesApi.list(unref(queryOptions))
      state.isErrored = false
      state.courses = courses
      state.totalCount = totalCount
      return courses
    } catch (error) {
      console.error("Failed to fetch courses:", error)
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
    refresh: fetch,
  }
}

export default useCourses
