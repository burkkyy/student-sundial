<template>
  <div class="d-flex">
    <v-text-field
      v-model="search"
      class="mb-4 mr-5"
      label="Search"
      density="compact"
    />
    <v-btn
      color="primary"
      :to="{ name: 'users/UserNewPage' }"
      style="height: 40px"
    >
      New User
    </v-btn>
  </div>

  <v-data-table-server
    v-model:items-per-page="perPage"
    :search="search"
    :page="page"
    :headers="headers"
    :items="users"
    :items-length="totalCount"
    :loading="isLoading"
    @update:page="updatePage"
    @click:row="(_event: unknown, { item }: UserTableRow) => goToUserEdit(item.id)"
  >
    <template #item.actions="{ item }">
      <div class="d-flex justify-end align-center">
        <v-btn
          :loading="isDeleting"
          title="Delete"
          icon="mdi-delete"
          size="x-small"
          class="ml-2"
          color="error"
          variant="outlined"
          @click="confirmThenDelete(item)"
        ></v-btn>
      </div>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import usersApi from "@/api/users-api"
import useSnack from "@/use/use-snack"
import useUsers, { User } from "@/use/use-users"
import { useRouteQuery } from "@vueuse/router"

type UserTableRow = {
  item: User
}

const { t } = useI18n()

const search = ref()

const headers = ref([
  { title: "Display Name", key: "displayName" },
  { title: "Email", key: "email" },
  { title: "Title", key: "title" },
  {
    title: "Department",
    key: "department",
    value: (item: unknown) => {
      const { department, division, branch, unit } = item as User
      return [department, division, branch, unit].filter(Boolean).join(" - ")
    },
  },
  {
    title: "Role",
    key: "roles",
    value: (item: unknown) => {
      const { roles } = item as User
      const formatedRoleTypes = roles.map((role) => t(`user.roles.${role}`, role))
      return formatedRoleTypes.join(", ")
    },
  },
  { title: "", key: "actions" },
])

const router = useRouter()
const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })

const usersQuery = computed(() => ({
  perPage: perPage.value,
  page: page.value,
}))

const { users, totalCount, isLoading, refresh } = useUsers(usersQuery)

function goToUserEdit(userId: number) {
  router.push({
    name: "users/UserEditPage",
    params: { userId },
  })
}

const snack = useSnack()
const isDeleting = ref(false)

async function confirmThenDelete(user: User) {
  const { displayName, email } = user
  const result = confirm(`Are you sure you want to delete ${displayName}: ${email}.`)
  if (result === false) return

  isDeleting.value = true
  try {
    await usersApi.delete(user.id)
    await refresh()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to load directory: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

// Necessary to avoid wiping page value due to bug in Vuetify table implementation
// which causes page value to be wiped if changed during loading state.
function updatePage(newPage: number) {
  if (isLoading.value) return

  page.value = newPage
}

defineExpose({ refresh })
</script>
