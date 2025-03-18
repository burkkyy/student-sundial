import { ComputedRef, computed, useSlots } from "vue"

type ComponentWithSlots = {
  $slots: {
    [key: string]: unknown
  }
}

type SlotNamesExtractor<T> = T extends ComponentWithSlots ? keyof T["$slots"] & string : never

export function useVuetifySlotNamesPassThrough<
  Component extends ComponentWithSlots = never,
  SlotNames extends SlotNamesExtractor<Component> = SlotNamesExtractor<Component>,
>(slotsToPassThrough: SlotNames[]): ComputedRef<SlotNames[]> {
  const wrappedSlotNames = new Set(slotsToPassThrough)

  const slots = useSlots()

  return computed(() => {
    return Object.keys(slots).filter((slotName): slotName is SlotNames =>
      wrappedSlotNames.has(slotName as SlotNames)
    )
  })
}

export default useVuetifySlotNamesPassThrough
