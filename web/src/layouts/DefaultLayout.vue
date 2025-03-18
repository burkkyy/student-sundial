<template>
  <LeftSidebarNavigationDrawer
    v-model="showDrawer"
    :show-rail="showRail"
  />

  <v-app-bar
    flat
    color="#434343"
  >
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    <v-app-bar-title
      v-if="mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
      >{{ title }}</v-app-bar-title
    >
    <v-app-bar-title
      v-if="!mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
    >
      <router-link
        :to="{ name: 'DashboardPage' }"
        style="color: white; text-decoration: none"
        >The Vault</router-link
      >
    </v-app-bar-title>

    <div
      :style="{ width: `${searchWidth}px` }"
      class="d-none"
    >
      <v-text-field
        v-model="searchValue"
        variant="outlined"
        label="Search"
        hide-details
        density="compact"
        class="ml-2"
        bg-color="#545454"
        @update:focused="updateSearchFocus"
      ></v-text-field>
    </div>
    <v-spacer />

    <v-btn
      class="mr-2"
      icon="mdi-archive-plus"
      :to="{ name: 'archive-item/ArchiveItemNewPage' }"
    />
    <v-btn
      class="mr-4"
      icon="mdi-call-split"
      :to="{ name: 'decisions/DecisionNewPage' }"
    />

    <KebabMenu />
  </v-app-bar>

  <v-main>
    <SimpleBreadcrumbs />

    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue"
import { useDisplay } from "vuetify"

import SimpleBreadcrumbs from "@/components/common/SimpleBreadcrumbs.vue"
import KebabMenu from "@/components/default-layout/KebabMenu.vue"
import LeftSidebarNavigationDrawer from "@/components/default-layout/LeftSidebarNavigationDrawer.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

const { mdAndUp } = useDisplay()

const showDrawer = ref(mdAndUp.value)
const showRail = ref(!mdAndUp.value)
const searchWidth = ref(120)
const searchValue = ref("")

const { title } = useBreadcrumbs()

watch(
  () => unref(mdAndUp),
  (newVal) => {
    console.log("NM", newVal)
    //!mobile || (mobile && showDrawer)
    if (!newVal) {
      showDrawer.value = true
      showRail.value = false
    } else {
      showDrawer.value = false
      showRail.value = true
    }
  }
)

function toggleDrawer() {
  console.log(mdAndUp.value)

  if (!mdAndUp.value) showDrawer.value = !showDrawer.value
  else {
    showRail.value = !showRail.value
  }
}

function updateSearchFocus(hasFocus: boolean) {
  if (hasFocus) {
    searchWidth.value = 300
  } else {
    searchWidth.value = 120
    searchValue.value = ""
  }
}
</script>
