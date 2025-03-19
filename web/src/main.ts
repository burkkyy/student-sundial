import { createApp } from "vue"
import { createPinia } from "pinia"

// Plugins
import vuetify from "@/plugins/vuetify-plugin"

import router from "@/router"

import App from "@/App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(router).use(vuetify)

app.mount("#app")
