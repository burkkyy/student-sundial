<template>
  <h2 class="mb-3">Yukon Government's Digital Archive</h2>
  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <v-card title="">
        <v-card-text>
          <p class="text-subtitle-1 mb-4">
            The Vault provides Yukon Government with an enduring record of Archive Items and
            Decisions. All staff can add items, but only those with special access privileges can
            view them.
          </p>

          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <ArchiveItemNewButton />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <DecisionNewButton />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                <router-link :to="{ name: 'archive-item/ArchiveItemListPage' }"
                  >View the Archive Items</router-link
                >
              </p>
            </v-col>
            <v-col>
              <p>
                <router-link :to="{ name: 'decisions/DecisionListPage' }"
                  >View the Decision Records</router-link
                >
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <VaultInfoCard />
      <VaultStatisticsCard />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import ArchiveItemNewButton from "@/components/archive-item/ArchiveItemNewButton.vue"
import VaultInfoCard from "@/components/common/VaultInfoCard.vue"
import VaultStatisticsCard from "@/components/common/VaultStatisticsCard.vue"
import DecisionNewButton from "@/components/decisions/DecisionNewButton.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Vault Home", [])
</script>

<style>
.v-card-item__prepend i {
  color: #7a7878;
}
</style>
