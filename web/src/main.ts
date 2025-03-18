import { createApp } from "vue"
import { createPinia } from "pinia" // TODO: move to plugins?

// Plugins
import vuetifyPlugin from "@/plugins/vuetify-plugin"
import auth0Plugin from "@/plugins/auth0-plugin"
import routerPlugin from "@/plugins/router-plugin"
import vueI18nPlugin from "@/plugins/vue-i18n-plugin"

import App from "@/App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(routerPlugin).use(vuetifyPlugin).use(auth0Plugin).use(vueI18nPlugin)

app.mount("#app")
