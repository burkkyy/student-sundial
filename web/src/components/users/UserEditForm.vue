<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <v-card-title>User Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.firstName"
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
              v-model="user.lastName"
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
              v-model="user.displayName"
              label="Display Name *"
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
              v-model="user.title"
              label="Title"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.email"
              label="Email *"
              :rules="[required]"
              variant="outlined"
              required
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
              v-model="user.department"
              label="Department"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.division"
              label="Division"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.branch"
              label="Branch"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.unit"
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
            <UserRolesSelect v-model="user.roles" />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <CategorySelect
              v-model="user.categories"
              label="Categories"
              multiple
              chips
              closable-chips
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <SourceSelect
              v-model="user.sources"
              label="Sources"
              multiple
              chips
              closable-chips
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn
              :loading="isLoading"
              color="secondary"
              variant="outlined"
              v-bind="cancelButtonOptions"
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
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, toRefs } from "vue"
import { useI18n } from "vue-i18n"

import { type VBtn, type VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import useSnack from "@/use/use-snack"
import useUser from "@/use/use-user"
import UserRolesSelect from "./UserRolesSelect.vue"
import CategorySelect from "../categories/CategorySelect.vue"
import SourceSelect from "../sources/SourceSelect.vue"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    userId: number
    cancelButtonOptions?: CancelButtonOptions
  }>(),
  {
    cancelButtonOptions: ({ userId }) => ({
      to: {
        name: "UserPage",
        params: { userId },
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [userId: number]
}>()

const { userId } = toRefs(props)
const { user, save, isLoading } = useUser(userId)

const snack = useSnack()

const form = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  if (isNil(user.value)) return

  await save()
  snack.success("User saved!")
  emit("saved", user.value.id)
}

const { t } = useI18n()

function formatRole(role: string) {
  return t(`user.roles.${role}`, role)
}
</script>
