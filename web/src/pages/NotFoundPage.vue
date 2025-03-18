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

<script lang="ts" setup>
import { APPLICATION_NAME } from "@/config"
import useStatus from "@/use/use-status"

const { releaseTag, gitCommitHash } = useStatus()
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
