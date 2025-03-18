import { computed, reactive, toRefs, unref } from "vue"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import currentUserApi from "@/api/current-user-api"
import usersApi, { type User, UserRoles } from "@/api/users-api"

export { type User, UserRoles }

// TODO: consider sending this with every api request?
export const CURRENT_USERS_TIMEZONE = DateTime.local().zoneName

// Global state
const state = reactive<{
  currentUser: User | null
  isLoading: boolean
  isErrored: boolean
  isCached: boolean
}>({
  currentUser: null,
  isLoading: false,
  isErrored: false,
  isCached: false,
})

type State = typeof state
type LoadedState = Omit<State, "currentUser"> & {
  currentUser: Exclude<State["currentUser"], null>
}

export function useCurrentUser<IsLoaded extends boolean = false>() {
  type StateOrLoadedState = IsLoaded extends true ? LoadedState : State

  const isReady = computed(() => state.isCached && !state.isLoading && !state.isErrored)
  const isSystemAdmin = computed(() => {
    return state.currentUser?.roles.includes(UserRoles.SYSTEM_ADMIN)
  })

  async function fetch(): Promise<User> {
    state.isLoading = true
    try {
      const { user } = await currentUserApi.get()
      state.isErrored = false
      state.currentUser = user
      state.isCached = true
      return user
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<User> {
    if (isNil(state.currentUser)) {
      throw new Error("No user to save")
    }

    const staticId = unref(state.currentUser.id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { user } = await usersApi.update(staticId, state.currentUser)
      state.isErrored = false
      state.currentUser = user
      return user
    } catch (error) {
      console.error("Failed to save current user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Needs to be called during logout or current user will persist.
  function reset() {
    state.currentUser = null
    state.isLoading = false
    state.isErrored = false
    state.isCached = false
  }

  return {
    ...toRefs(state as StateOrLoadedState),
    isReady,
    fetch,
    refresh: fetch,
    reset,
    save,
    // Computed properties
    isSystemAdmin,
  }
}

export default useCurrentUser
