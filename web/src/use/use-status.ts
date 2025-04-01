import { reactive, toRefs } from "vue"

import statusApi, { type Status } from "@/api/status-api"

export { type Status }

export function useStatus() {
  const state = reactive<{
    releaseTag: null | string
    gitCommitHash: null | string
    isLoading: boolean
    isErrored: boolean
  }>({
    releaseTag: null,
    gitCommitHash: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Status> {
    state.isLoading = true
    try {
      const status = await statusApi.get()
      state.isErrored = false
      state.releaseTag = status.RELEASE_TAG
      state.gitCommitHash = status.GIT_COMMIT_HASH
      return status
    } catch (error) {
      console.error("Failed to fetch status:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Fetch status immediately
  fetch()

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useStatus
