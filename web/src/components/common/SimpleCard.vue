<template>
  <v-card
    class="mb-5 simple-card"
    :color="getColor()"
  >
    <v-card-title
      v-if="title"
      class="d-flex"
      :class="{ 'mb-n3': subtitle }"
      >{{ title }}
      <v-spacer />
      <slot name="rightTitle"></slot>
    </v-card-title>
    <v-card-subtitle
      v-if="subtitle"
      :class="{ 'mt-3': !title }"
      >{{ subtitle }}</v-card-subtitle
    >
    <v-card-text :class="{ 'mt-n5': subtitle }"> <slot></slot> </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { useTheme } from "vuetify/lib/framework.mjs"

const theme = useTheme()

const { current } = theme
const props = defineProps<{
  title?: string
  subtitle?: string
  color?: string
}>()

function getColor() {
  const color = props.color || "#F0F4EA"
  const themeColor = current.value.colors[color]

  if (!isNil(themeColor)) {
    if (color === "success") return `#D5E9BA`
    if (color === "error") return `#E7DFE7`

    return `${themeColor}55`
  }

  console.log(color, themeColor)

  return color
}
</script>
