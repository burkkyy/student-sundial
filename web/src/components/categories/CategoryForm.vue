<template>
  <v-form
    ref="form"
    v-model="isValid"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <v-card-title>Category Details</v-card-title>
      <v-card-text>
        <v-row
          v-if="item"
          class="mb-3"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="item.name"
              :rules="[rules.required]"
              label="Name"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <RetentionSelect
              v-model="item.retentionId"
              :rules="[rules.required]"
              label="Retention"
            />
          </v-col>

          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="item.description"
              label="Description"
              rows="3"
            />
          </v-col>
        </v-row>

        <div class="d-flex">
          <v-btn
            :disabled="!isValid"
            :loading="isLoading"
            type="submit"
            >Save</v-btn
          >
          <v-spacer />
          <v-btn
            color="secondary"
            variant="outlined"
            :to="{ name: 'administration/CategoryListPage' }"
            >Cancel</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/lib/components/index.mjs"

import useSnack from "@/use/use-snack"
import useCategory from "@/use/use-category"

import RetentionSelect from "../retentions/RetentionSelect.vue"

const rules = {
  required: (value: string | null) => !!value || "Field is required",

  email(value: string | null) {
    if (isNil(value) || isEmpty(value)) return true
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
    return "Must be a valid e-mail."
  },
}

const isValid = ref(false)

const props = defineProps<{
  categoryId: string | null
}>()

const categoryId = computed(() => (props.categoryId ? parseInt(props.categoryId) : null))

const snack = useSnack()
const router = useRouter()

const { item, isUpdate, save } = useCategory(categoryId)

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
    await save()

    if (isUpdate) snack.success("Category saved.")
    else snack.success("Category created.")

    router.push({ name: "administration/CategoryListPage" })
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
