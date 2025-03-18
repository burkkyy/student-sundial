<template>
  <v-card title="Administration">
    <v-card-text>
      <v-row>
        <v-col>
          <v-card
            color="info"
            title="Users"
            subtitle="Manage Current Users"
            :to="{ name: 'users/UsersPage' }"
          >
          </v-card>
        </v-col>
        <v-col>
          <v-card
            color="info"
            title="Sources"
            subtitle="Manage Sources"
            :to="{ name: 'administration/SourceListPage' }"
          >
          </v-card>
        </v-col>
        <v-col>
          <v-card
            color="info"
            title="Retentions"
            subtitle="Manage Current Users"
            :to="{ name: 'administration/RetentionListPage' }"
          >
          </v-card>
        </v-col>
        <v-col>
          <v-card
            color="info"
            title="Categories"
            subtitle="Manage Current Users"
            :to="{ name: 'administration/CategoryListPage' }"
          >
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Administration Dashboard", [
  /* {
    title: "Administration Dashboard",
    to: { name: "administration/DashboardPage" },
  }, */
])
</script>
