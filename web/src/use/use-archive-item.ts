import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import archiveItemsApi, { type ArchiveItemCreate, type ArchiveItem } from "@/api/archive-items-api"

export { type ArchiveItem }

export function useArchiveItem(id: Ref<number | null | undefined>) {
  const state = reactive<{
    item: ArchiveItem | null
    createItem: ArchiveItemCreate | null
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

  async function fetch(): Promise<ArchiveItem> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { archiveItem } = await archiveItemsApi.get(staticId)
      state.isErrored = false
      state.item = archiveItem
      return archiveItem
    } catch (error) {
      console.error("Failed to fetch arhive item:", error)

      

      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<ArchiveItem> {
    if (state.isUpdate) return update()
    else return create()
  }

  async function update(): Promise<ArchiveItem> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.item)) {
      throw new Error("No category to save")
    }

    state.isLoading = true
    try {
      const { archiveItem } = await archiveItemsApi.update(staticId, state.item)
      state.isErrored = false
      state.item = archiveItem
      return archiveItem
    } catch (error) {
      console.error("Failed to save archiveItem:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(): Promise<ArchiveItem> {
    const staticId = unref(id)
    if (!isNil(staticId)) {
      throw new Error("id is not required")
    }

    if (isNil(state.createItem)) {
      throw new Error("No archiveItem to save")
    }

    state.isLoading = true
    try {
      const { archiveItem } = await archiveItemsApi.create(state.createItem)
      state.isErrored = false
      state.item = archiveItem
      return archiveItem
    } catch (error) {
      console.error("Failed to create archiveItem:", error)
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

export default useArchiveItem
