<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <SimpleCard
          v-if="isSystemAdmin"
          color="secondary"
          to="/administration"
          title="Admin only Card"
        />
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <SimpleCard
          color="secondary"
          to="/administration/users"
          title="Manage Users"
          :loading="userIsLoading"
        >
          <div class="mb-n3 mt-n7 text-right">
            <span style="font-size: 16px">Active Users:</span>&nbsp;
            <span style="font-size: 40px">{{ userCount }}</span>
          </div>
        </SimpleCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import SimpleCard from "@/components/common/SimpleCard.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import useUsers from "@/use/use-users"
import { ref } from "vue"

const { isSystemAdmin } = useCurrentUser<true>()

useBreadcrumbs("Administration", [])

const { totalCount: userCount, isLoading: userIsLoading } = useUsers(
  ref({ where: { isActive: true } })
)
</script>
