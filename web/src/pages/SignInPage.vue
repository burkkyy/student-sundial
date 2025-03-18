<template>
  <div class="fill-height">
    <v-row
      class="h-100vh mh-100 auth my-0"
      :class="{ 'fill-height': !mdAndDown }"
    >
      <v-col
        cols="12"
        lg="8"
        xl="9"
        class="d-lg-flex align-center justify-center"
        style="overflow: hidden"
      >
        <v-icon
          class="d-none d-lg-flex"
          color="primary"
          size="400"
          style="opacity: 0.05"
          >mdi-shield-key</v-icon
        >
      </v-col>
      <v-col
        cols="12"
        lg="4"
        xl="3"
        class="d-flex align-center justify-center pl-0 bg-surface"
      >
        <div
          class="d-flex align-center justify-center py-5"
          style="
            width: 100%;
            background-color: #ddd;
            border-top: 10px #aaa solid;
            border-bottom: 10px #aaa solid;
          "
        >
          <v-icon
            v-if="mdAndDown"
            color="primary"
            :size="smAndUp ? 200 : 100"
            style="opacity: 0.65"
            >mdi-shield-key</v-icon
          >
          <div class="text-center">
            <h2 class="text-h3 font-weight-semibold mb-2">{{ APPLICATION_NAME }}</h2>
            <div class="text-subtitle-1 mb-6 mt-n3 font-weight-bold">Yukon Government</div>
            <div class="mt-6 text-center">
              <v-btn
                color="primary"
                @click="loginWithRedirect"
              >
                Sign in
              </v-btn>
              <div class="text-subtitle-1 mt-5">Using your YNET Credentials</div>
              <v-divider class="my-2" />
              <em style="font-weight: 700">Secure Digital Storage</em>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { useDisplay } from "vuetify/lib/framework.mjs"

import { APPLICATION_NAME } from "@/config"
import useCurrentUser from "@/use/use-current-user"

const { mdAndDown, smAndUp } = useDisplay()

const { reset: resetCurrentUser } = useCurrentUser()

const { loginWithRedirect } = useAuth0()

onMounted(() => {
  resetCurrentUser()
})
</script>
