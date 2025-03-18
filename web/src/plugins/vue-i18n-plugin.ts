import { createI18n } from "vue-i18n"

// I'd prefer to use yaml, or even json, but I can't get them to import at the moment
// This might be a TypeScript issue, or I might need a yaml plugin.
import en from "@/locales/en.js"

export default createI18n({
  legacy: false, // support composition api
  locale: "en",
  messages: {
    en,
  },
})
