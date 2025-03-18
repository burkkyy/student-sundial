<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        :model-value="formattedDate"
        append-inner-icon="mdi-calendar"
        readonly
        v-bind="{ ...fieldOptions, ...menuProps }"
      />
    </template>

    <v-date-picker
      :model-value="date"
      v-bind="dateOptions"
      @update:model-value="updateDateAndCloseMenu"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { DateTime } from "luxon"
import { VDatePicker, VTextField } from "vuetify/lib/components/index.mjs"

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    dateOptions?: VDatePicker["$props"] | null
    fieldOptions?: VTextField["$props"] | null
  }>(),
  {
    modelValue: null,
    dateOptions: null,
    fieldOptions: null,
  }
)

const emit = defineEmits(["update:modelValue"])

const menu = ref(false)
const date = ref<Date | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      date.value = null
      return
    }

    const newDateTime = DateTime.fromISO(newValue)
    date.value = newDateTime.toJSDate()
  },
  {
    immediate: true,
  }
)

const formattedDate = computed(() => {
  if (date.value === null) return ""

  const dateTime = DateTime.fromJSDate(date.value)
  const dateString = dateTime.toFormat("yyyy-MM-dd")
  return dateString
})

function updateDateAndCloseMenu(newDate: unknown) {
  if (newDate instanceof Date) {
    date.value = newDate
    emit("update:modelValue", newDate.toISOString())
  } else {
    date.value = null
    emit("update:modelValue", null)
  }

  menu.value = false
}
</script>
