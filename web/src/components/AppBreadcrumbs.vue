<template>
  <v-sheet
    color="breadcrumb-bar-color"
    style="border-top: 1px #96c951 solid; border-bottom: 1px #96c951 solid"
  >
    <v-container
      v-if="breadcrumbsWithExactTrueByDefault.length > 0 || !isNil(title)"
      fluid
      class="py-0 pb-2 mt-0 pt-2 px-6"
    >
      <h2>{{ title }}</h2>

      <v-breadcrumbs
        :items="breadcrumbsWithExactTrueByDefault"
        large
        class="pa-0 mb-0"
      >
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
export { type Breadcrumb } from "@/use/use-breadcrumbs"
</script>

<script lang="ts" setup>
import { computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { isNil } from "lodash"

const { breadcrumbs, title } = useBreadcrumbs()

// Changes https://vuetifyjs.com/en/components/breadcrumbs/ default behavior.
// By default v-breadcrumbs will disable all crumbs up to the current page in a nested paths.
// You can prevent this behavior by using exact: true on each applicable breadcrumb in the items array.
const breadcrumbsWithExactTrueByDefault = computed(() =>
  breadcrumbs.value.map((item) => ({
    ...item,
    exact: item.exact ?? true,
    disabled: item.disabled ?? false,
  }))
)
</script>
