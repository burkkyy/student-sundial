import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import retentionsApi, { Retention } from "@/api/retentions-api"

export { type Retention }

export function useRetention(id: Ref<number | null | undefined>) {
  const state = reactive<{
    item: Retention | null
    isUpdate: boolean
    isLoading: boolean
    isErrored: boolean
  }>({
    item: null,
    isUpdate: !isNil(id.value),
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Retention> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { retention } = await retentionsApi.get(staticId)
      state.isErrored = false
      state.item = retention
      return retention
    } catch (error) {
      console.error("Failed to fetch retention:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Retention> {
    if (state.isUpdate) return update()
    else return create()
  }

  async function update(): Promise<Retention> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.item)) {
      throw new Error("No retention to save")
    }

    state.isLoading = true
    try {
      const { retention } = await retentionsApi.update(staticId, state.item)
      state.isErrored = false
      state.item = retention
      return retention
    } catch (error) {
      console.error("Failed to save retention:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(): Promise<Retention> {
    const staticId = unref(id)
    if (!isNil(staticId)) {
      throw new Error("id is not required")
    }

    if (isNil(state.item)) {
      throw new Error("No retention to save")
    }

    state.isLoading = true
    try {
      const { retention } = await retentionsApi.create(state.item)
      state.isErrored = false
      state.item = retention
      return retention
    } catch (error) {
      console.error("Failed to create retention:", error)
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

export default useRetention
