import { createApp } from "vue"
import { createPinia } from "pinia"

// Plugins
import vuetifyPlugin from "@/plugins/vuetify-plugin"
import auth0Plugin from "@/plugins/auth0-plugin"
import routerPlugin from "@/plugins/router-plugin"

import App from "@/App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(routerPlugin).use(vuetifyPlugin).use(auth0Plugin)

app.mount("#app")
