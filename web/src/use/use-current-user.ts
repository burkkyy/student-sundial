import { computed, reactive, toRefs } from "vue"

import { sleep } from "@/utils/sleep"
import usersApi, { RoleTypes, Role, User } from "@/api/users-api"
import { isEmpty, isNil } from "lodash"

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

  const isReady = computed(() => !state.isLoading && !state.isErrored)

  const isSystemAdmin = computed(() => {
    return hasRole(RoleTypes.SYSTEM_ADMIN)
  })

  function hasRole(desiredRole: RoleTypes): boolean {
    if (isNil(state.currentUser?.roles)) return false
    if (isEmpty(state.currentUser?.roles)) return false

    const firstItem = state.currentUser?.roles[0]

    if (typeof firstItem == "string")
      return state.currentUser?.roles?.some((role) => role.role === desiredRole)
    else return (state.currentUser?.roles as Role[])?.some(({ role }: Role) => role === desiredRole)
  }

  async function fetch(): Promise<User> {
    state.isLoading = true
    try {
      const { user } = await usersApi.fetchCurrentUser()
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

  async function ensure(): Promise<User | null> {
    // TODO: add max timeout
    while (state.isLoading) {
      await sleep(75)
    }

    if (state.isErrored) {
      console.error("Current user store has errored, returning state.currentUser.")
      return state.currentUser
    }

    // Trust the back-end and above logic; when state.isCached, user must be a full user.
    if (state.isCached) return state.currentUser as User

    return fetch()
  }

  // I think this needs to be called during logout or current user will persist?
  function reset() {
    state.currentUser = null
    state.isLoading = false
    state.isErrored = false
    state.isCached = false
  }

  return {
    ...toRefs(state as StateOrLoadedState),
    isReady,
    isSystemAdmin,
    fetch,
    ensure,
    reset,
  }
}

export default useCurrentUser
