import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import sourcesApi, { type Source } from "@/api/sources-api"

export { type Source }

export function useSource(id: Ref<number | null | undefined>) {
  const state = reactive<{
    item: Source | null
    isUpdate: boolean
    isLoading: boolean
    isErrored: boolean
  }>({
    item: null,
    isUpdate: !isNil(id.value),
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Source> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { source } = await sourcesApi.get(staticId)
      state.isErrored = false
      state.item = source
      return source
    } catch (error) {
      console.error("Failed to fetch source:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Source> {
    if (state.isUpdate) return update()
    else return create()
  }

  async function update(): Promise<Source> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.item)) {
      throw new Error("No source to save")
    }

    state.isLoading = true
    try {
      const { source } = await sourcesApi.update(staticId, state.item)
      state.isErrored = false
      state.item = source
      return source
    } catch (error) {
      console.error("Failed to save source:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(): Promise<Source> {
    const staticId = unref(id)
    if (!isNil(staticId)) {
      throw new Error("id is not required")
    }

    if (isNil(state.item)) {
      throw new Error("No source to save")
    }

    state.isLoading = true
    try {
      const { source } = await sourcesApi.create(state.item)
      state.isErrored = false
      state.item = source
      return source
    } catch (error) {
      console.error("Failed to create source:", error)
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

export default useSource
