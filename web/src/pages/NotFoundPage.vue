<template>
  <v-container class="text-center mt-16">
    <h1>Error 404</h1>
    <p>Oops! The page you're looking doesn't exist.</p>
    <hr />
    <p>Site: {{ APPLICATION_NAME }}</p>
    <p>Version: {{ releaseTag }}</p>
    <p>Commit Hash: {{ gitCommitHash }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import http from "@/api/http-client"

import { APPLICATION_NAME } from "@/config"

const releaseTag = ref("not-set")
const gitCommitHash = ref("not-set")

const isLoading = ref(true)

onMounted(async () => {
  await refresh()
})

async function fetchVersion() {
  return http
    .get("/_status")
    .then(({ data }) => {
      releaseTag.value = data.RELEASE_TAG
      gitCommitHash.value = data.GIT_COMMIT_HASH
      return data
    })
    .catch((error: unknown) => {
      console.error(`Error fetching version: ${error}`)
    })
}

async function refresh() {
  isLoading.value = true
  try {
    await fetchVersion()
  } catch (error) {
    console.error(`Error fetching version: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
body {
  text-align: center;
  padding-top: 100px;
}
hr {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
