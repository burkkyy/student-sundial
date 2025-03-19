<template>
  <v-container
    tag="section"
    class="mt-10"
  >
    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        lg="11"
        sm="8"
        xl="7"
      >
        <v-card
          class="elevation-5"
          style="overflow: hidden"
        >
          <v-row>
            <v-col
              lg="7"
              style="background-color: #e9f8fd"
              class="d-none d-md-flex align-center justify-center"
            >
              <div class="d-none d-sm-block">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  style="width: 300px"
                  class="d-md-block pl-6"
                />
                <div class="align-center pa-6 pt-1">
                  <h2
                    class="text-h5 mb-2 text-center"
                    style="line-height: 40px"
                  >
                    {{ APPLICATION_NAME }}
                  </h2>
                </div>
              </div>
            </v-col>
            <v-col lg="5">
              <div class="pa-7 pa-sm-12">
                <div
                  style="background-color: #e9f8fd"
                  class="pa-5 d-md-none"
                >
                  <img
                    src="/Logo.png"
                    alt="Logo"
                    style="width: 300px"
                    class="d-md-inline"
                  />
                  <h2
                    class="font-weight-medium text-center"
                    style="line-height: 40px"
                  >
                    {{ APPLICATION_NAME }}
                  </h2>
                </div>

                <h2 class="text-h5 mt-4">Sign in</h2>
                <h6 class="text-subtitle-2 mt-3 mb-5">
                  This application is only available to authorized users. If you have an account,
                  click the button below.
                </h6>

                <v-btn
                  dark
                  color="primary"
                  text="Sign In"
                />
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { APPLICATION_NAME } from "@/config"
</script>
