<template>
  <v-form
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <v-card-title>User Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="userAttributes.email"
              label="Email *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.firstName"
              label="First name *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.lastName"
              label="Last name *"
              :rules="[required]"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.displayName"
              label="Display Name"
              variant="outlined"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.title"
              label="Title"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title>Organizational Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.department"
              label="Department"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.division"
              label="Division"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.branch"
              label="Branch"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="userAttributes.unit"
              label="Unit"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title>Roles</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <UserRolesSelect
              v-model="userAttributes.roles"
              label="Roles *"
              :rules="[required]"
              class="mt-6"
              variant="outlined"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              :to="{ name: 'users/UsersPage' }"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              class="ml-3"
              :loading="isLoading"
              type="submit"
              color="primary"
            >
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import usersApi, { type User, UserRoles } from "@/api/users-api"
import useSnack from "@/use/use-snack"

import UserRolesSelect from "@/components/users/UserRolesSelect.vue"

const snack = useSnack()
const router = useRouter()

const userAttributes = ref<Partial<User>>({
  roles: [UserRoles.USER],
})
const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    await usersApi.create(userAttributes.value)
    snack.success("User created.")
    router.push({ name: "users/UsersPage" })
  } catch (error) {
    snack.error("Failed to create user!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
