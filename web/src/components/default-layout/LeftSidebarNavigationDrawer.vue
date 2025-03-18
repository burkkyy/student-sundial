<template>
  <v-navigation-drawer
    v-model="showDrawer"
    :disable-resize-watcher="false"
    :rail="showRail"
    :permanent="mdAndUp"
    :location="!mdAndUp ? 'bottom' : undefined"
    color="#212121"
  >
    <v-list
      v-model:opened="open"
      class="pt-0"
      color="warning"
    >
      <v-list-item
        prepend-icon="mdi-shield-key"
        style="height: 64px"
        :to="{ name: 'DashboardPage' }"
      >
        <span class="text-h6">The Vault</span>
      </v-list-item>

      <v-list-item
        title="Archive Items"
        :to="{ name: 'archive-item/ArchiveItemListPage' }"
        :exact="false"
        prepend-icon="mdi-archive"
      />

      <v-list-item
        :to="{ name: 'decisions/DecisionListPage' }"
        title="Decisions"
        prepend-icon="mdi-call-split"
      />

      <v-list-item
        v-if="isSystemAdmin"
        title="Administration"
        :to="{ name: 'administration/DashboardPage' }"
        :exact="false"
        prepend-icon="mdi-cog"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue"

import useCurrentUser from "@/use/use-current-user"
import { useDisplay } from "vuetify/lib/framework.mjs"

const { mdAndUp } = useDisplay()

defineProps<{ showRail: boolean }>()

const showDrawer = defineModel<boolean>({
  default: false,
})

const open = ref([])

const { isSystemAdmin } = useCurrentUser()
</script>
