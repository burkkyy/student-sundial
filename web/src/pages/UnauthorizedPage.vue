<template>
  <v-container class="text-center mt-16">
    <h1>Unauthorized (401)</h1>
    <p>Authentication failed. If you think this is an error, please contact support.</p>
    <p>Alternatively, try logging out and signing in again.</p>
    <v-row class="mt-6">
      <v-spacer />
      <v-col>
        <!-- href="/" performs a more aggressive refresh than using to="xxx" -->
        <v-btn
          color="primary"
          variant="outlined"
          @click="goBack"
          >Back</v-btn
        >
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col>
        <!-- href="/" performs a more aggressive refresh than using to="xxx" -->
        <v-btn
          color="primary"
          variant="outlined"
          href="/"
          >Reboot App</v-btn
        >
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col>
        <v-btn
          color="primary"
          @click="signOut"
          >Logout</v-btn
        >
      </v-col>
      <v-spacer />
    </v-row>
    <hr />
    <p>Site: {{ APPLICATION_NAME }}</p>
    <p>Version: {{ releaseTag }}</p>
    <p>Commit Hash: {{ gitCommitHash }}</p>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue"

import { APPLICATION_NAME } from "@/config"
import useCurrentUser from "@/use/use-current-user"
import useStatus from "@/use/use-status"

const { logout } = useAuth0()
const { reset: resetCurrentUser } = useCurrentUser()

const { releaseTag, gitCommitHash } = useStatus()

function goBack() {
  window.history.back()
}

async function signOut() {
  resetCurrentUser()

  const returnTo = encodeURI(window.location.origin + "/sign-in")
  return logout({
    logoutParams: {
      returnTo,
    },
  })
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
