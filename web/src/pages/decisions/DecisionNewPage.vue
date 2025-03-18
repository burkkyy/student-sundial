<template>
  <v-form
    v-if="createItem"
    ref="form"
    v-model="isValid"
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <h2 class="mb-3">Background Information</h2>
        <v-card class="mb-5">
          <FileDrop @files-dropped="handleFileDrop">
            <v-card-title>Description</v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="createItem.title"
                    :rules="[rules.required]"
                    label="Title"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="createItem.description"
                    label="Description"
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-title>Categories and Tags</v-card-title>
            <v-card-text>
              <CategorySelectWithRetention
                v-model="createItem.categories"
                :rules="[rules.required]"
                :hide-details="false"
                label="Categories"
              />
              <v-combobox
                v-model="createItem.tags"
                label="Tags"
                multiple
                chips
                clearable
              />
            </v-card-text>

            <v-card-title>Attachments</v-card-title>
            <v-card-text>
              <p class="mb-4">Drag and drop files or click the box belox</p>
              <v-file-input
                v-model="createItem.files"
                multiple
                chips
                clearable
                label="Attachments"
              />
            </v-card-text>
          </FileDrop>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <h2 class="mb-3">Decision</h2>
        <v-card
          variant="tonal"
          class="mb-5"
        >
          <v-card-title>Record Your Decision</v-card-title>
          <v-card-text>
            <p class="mb-5">
              Please review all of the Background Information and then select a decision below. If
              you were not provided enough information to make your decision, you can visit the
              Source url or "Reject".
            </p>
            <p class="mb-5">
              The retention for this decision is determined by the selected categories or can be
              overridden for a longer period by a Records Manager.
            </p>
            <p class="mb-5">
              When you click a button below, you will be prompted for a confirmation and the
              decision will be recorded in the Digital Vault along with all Background Information.
            </p>
            <p class="mb-5 font-weight-bold">
              After your decision is made, you will be forwarded back to the source system.
            </p>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-btn
                  color="success"
                  block
                  :disabled="!isValid"
                  @click="saveWrapper('Approve')"
                  >Approve</v-btn
                >
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-btn
                  color="error"
                  block
                  :disabled="!isValid"
                  @click="saveWrapper('Reject')"
                  >Reject</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

import useSnack from "@/use/use-snack"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useDecision from "@/use/use-decision"
import { SecurityLevel } from "@/api/decisions-api"
import { VForm } from "vuetify/lib/components/index.mjs"
import { isArray, isEmpty, isNil } from "lodash"
import { useRouter } from "vue-router"
import FileDrop from "@/components/common/FileDrop.vue"
import CategorySelectWithRetention from "@/components/categories/CategorySelectWithRetention.vue"
import useCategories from "@/use/use-categories"
import { DateTime } from "luxon"

const rules = {
  required: (value: string | null) => !!value || "Field is required",

  email(value: string | null) {
    if (isNil(value) || isEmpty(value)) return true
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
    return "Must be a valid e-mail."
  },
}

const { createItem, isUpdate, save } = useDecision(ref(null))
const { items } = useCategories()
const snack = useSnack()
const router = useRouter()

const isValid = ref(false)
const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)

useBreadcrumbs("Record a Decision", [
  BASE_CRUMB,
  { title: "Decisions", to: { name: "decisions/DecisionListPage" } },
])

onMounted(() => {
  createItem.value = {
    title: "",
    decisionText: "",
    securityLevel: SecurityLevel.LOW,
    description: null,
    expireAction: null,
    calculatedExpireDate: null,
    overrideExpireDate: null,
    retentionName: null,
    summary: null,
    categories: null,
    tags: [],
    files: [],
  }
})

watch(
  () => createItem.value?.categories,
  (newValue) => {
    if (createItem.value && newValue) {
      const category = items.value.find((i) => i.id == (isArray(newValue) ? newValue[0] : newValue))

      if (category && category.retention) {
        createItem.value.retentionName = category.retention.name
        createItem.value.expireAction = category.retention.expireAction

        if (category.retention.retentionDate) {
          createItem.value.calculatedExpireDate = category.retention.retentionDate
        } else if (category.retention.retentionDays) {
          createItem.value.calculatedExpireDate = DateTime.now()
            .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
            .toUTC()
            .plus({ days: category.retention.retentionDays })
            .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        }
      }
    }
  }
)

function handleFileDrop(droppedFiles: File[]) {
  if (createItem.value) createItem.value.files = droppedFiles
}

async function saveWrapper(decisionText: string) {
  if (isNil(form.value)) return
  if (isNil(decisionText)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  if (createItem.value) createItem.value.decisionText = decisionText

  isLoading.value = true
  try {
    await save()

    if (isUpdate) snack.success("Item saved.")
    else snack.success("Item created.")

    router.push({ name: "decisions/DecisionListPage" })
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
