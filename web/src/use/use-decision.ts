import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import decisionsApi, { type DecisionCreate, type Decision } from "@/api/decisions-api"

export { type Decision }

export function useDecision(id: Ref<number | null | undefined>) {
  const state = reactive<{
    item: Decision | null
    createItem: DecisionCreate | null
    isUpdate: boolean
    isLoading: boolean
    isErrored: boolean
  }>({
    item: null,
    createItem: null,
    isUpdate: !isNil(id.value),
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Decision> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { decision } = await decisionsApi.get(staticId)
      state.isErrored = false
      state.item = decision
      return decision
    } catch (error) {
      console.error("Failed to fetch decision:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Decision> {
    if (state.isUpdate) return update()
    else return create()
  }

  async function update(): Promise<Decision> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.item)) {
      throw new Error("No decision to save")
    }

    state.isLoading = true
    try {
      const { decision } = await decisionsApi.update(staticId, state.item)
      state.isErrored = false
      state.item = decision
      return decision
    } catch (error) {
      console.error("Failed to save decision:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(): Promise<Decision> {
    const staticId = unref(id)
    if (!isNil(staticId)) {
      throw new Error("id is not required")
    }

    if (isNil(state.createItem)) {
      throw new Error("No decision to save")
    }

    state.isLoading = true
    try {
      const { decision } = await decisionsApi.create(state.createItem)
      state.isErrored = false
      state.item = decision
      return decision
    } catch (error) {
      console.error("Failed to create decision:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) {
        ;(state.item as unknown) = { name: "" }

        return
      }

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    save,
  }
}

export default useDecision
