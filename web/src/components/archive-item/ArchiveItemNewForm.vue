<template>
  <v-form
    v-if="createItem"
    ref="form"
    v-model="isValid"
    @submit.prevent="saveWrapper"
  >
    <v-card>
      <FileDrop @files-dropped="handleFileDrop">
        <v-card-title>Archive Item Description</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="createItem.title"
                label="Title"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <SecurityLevelSelect
                v-model="createItem.securityLevel"
                :rules="[rules.required]"
                label="Security level"
              />
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

        <v-card-title>Retention</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <RetentionSelect
                v-model="retention"
                :rules="[rules.required]"
                return-object
                label="Policy"
              />
            </v-col>
            <v-col
              v-if="retention"
              cols="12"
              md="4"
              ><v-text-field
                :model-value="formatDate(createItem.calculatedExpireDate)"
                label="Expires on"
                append-inner-icon="mdi-lock"
                readonly
              />
            </v-col>
            <v-col
              v-if="retention"
              cols="12"
              md="4"
            >
              <v-text-field
                :model-value="createItem.expireAction"
                label="When item expires"
                append-inner-icon="mdi-lock"
                readonly
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Categories and Tags</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Categories and Tags are used as filter criteria to find items in the archive as well as
            determine who can see the items. You can select as many of each as are applicable to
            this item. Additional categories potentially increase the number of people that can see
            this information, but also make it more accessible in the future.
          </p>
          <CategorySelect
            v-model="createItem.categories"
            :rules="[rules.required]"
            :hide-details="false"
            label="Categories"
            hide-selected
            clearable
            multiple
            chips
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

          <v-btn
            type="submit"
            class="mt-5"
            :disabled="!isValid"
            >Save</v-btn
          >
        </v-card-text>
      </FileDrop>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/lib/components/index.mjs"
import { DateTime } from "luxon"

import useSnack from "@/use/use-snack"
import useArchiveItem from "@/use/use-archive-item"

import { SecurityLevel } from "@/api/archive-items-api"
import { Retention } from "@/api/retentions-api"
import { formatDate } from "@/utils/formatters"

import RetentionSelect from "@/components/retentions/RetentionSelect.vue"
import FileDrop from "@/components/common/FileDrop.vue"
import CategorySelect from "@/components/categories/CategorySelect.vue"
import SecurityLevelSelect from "@/components/archive-item/SecurityLevelSelect.vue"

const rules = {
  required: (value: string | null) => !!value || "Field is required",

  email(value: string | null) {
    if (isNil(value) || isEmpty(value)) return true
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
    return "Must be a valid e-mail."
  },
}

const isValid = ref(false)

const snack = useSnack()
const router = useRouter()

const { createItem, isUpdate, save } = useArchiveItem(ref(null))

const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)

const retention = ref<Retention>()

onMounted(() => {
  createItem.value = {
    title: "",
    securityLevel: SecurityLevel.LOW,
    description: null,
    expireAction: null,
    calculatedExpireDate: null,
    overrideExpireDate: null,
    retentionName: null,
    summary: null,
    categories: [],
    tags: [],
    files: [],
  }
})

watch(
  () => retention.value,
  async (newRetention) => {
    if (createItem.value && newRetention) {
      createItem.value.retentionName = newRetention.name
      createItem.value.expireAction = newRetention.expireAction

      if (newRetention.retentionDate) {
        createItem.value.calculatedExpireDate = newRetention.retentionDate
      } else if (newRetention.retentionDays) {
        createItem.value.calculatedExpireDate = DateTime.now()
          .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
          .toUTC()
          .plus({ days: newRetention.retentionDays })
          .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
      }
    }
  }
)
function handleFileDrop(droppedFiles: File[]) {
  if (createItem.value) createItem.value.files = droppedFiles
}

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

    if (isUpdate) snack.success("Item saved.")
    else snack.success("Item created.")

    router.push({ name: "archive-item/ArchiveItemListPage" })
  } catch (error) {
    snack.error("Save failed!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
