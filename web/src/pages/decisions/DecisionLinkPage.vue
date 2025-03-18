<template>
  <v-form>
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <h2 class="mb-3">Background Information</h2>
        <v-card class="mb-5">
          <v-card-title>Description</v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Title"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Description"
                  readonly
                  rows="3"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="source"
                  label="Source"
                  readonly
                  rows="3"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="sourceUrl"
                  label="Source url"
                  readonly
                  rows="3"
                />
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-title>Categories and Tags</v-card-title>
          <v-card-text>
            <v-select
              v-model="categoryNames"
              :hide-details="false"
              label="Categories"
              multiple
              chips
              readonly
            />
            <v-combobox
              v-model="tags"
              label="Tags"
              multiple
              chips
              clearable
            />
          </v-card-text>
          
          <v-card-title>Attachments</v-card-title>
          <v-card-text v-if="files && files.length > 0">
            <v-row>
              <v-col
                v-for="file of files"
                :key="file.id"
                cols="12"
                md="3"
              >
                <v-card class="bg-secondary fill-height">
                  <v-card-text>
                    {{ file.originalFileName }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else> No Attachments </v-card-text>
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
import { ref } from "vue"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

const files = ref([{ originalFileName: "SJ-Signed.pdf", id: 12 }])
const title = ref("Staffing Justification for Additional DBA Position")
const description = ref(
  "ICT needs more DBAs to be able to support all of these applications Ice Fog Analytics is building. An additional DBA is required."
)
const source = ref("WRAP")
const sourceUrl = ref("https://wrap.com/hpw-7Hg-88V/view")
const categoryNames = ref(["HPW Human Resources", "Staffing Justifications"])
const tags = ref([])

useBreadcrumbs("Record a Decision", [
  BASE_CRUMB,
  { title: "Decisions", to: { name: "decisions/DecisionListPage" } },
])
</script>
