/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import "@/assets/normalize.css"
import "@/assets/main.scss"

// ComposablesF
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import * as labsComponents from "vuetify/labs/components"

import { STUDENT_SUNDIAL_THEME } from "@/theme/LightTheme"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  theme: {
    defaultTheme: "STUDENT_SUNDIAL_THEME",
    themes: {
      STUDENT_SUNDIAL_THEME,
    },
  },
  directives,

  defaults: {
    VCard: {
      rounded: "md",
      elevation: 0,
      border: true,
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      autocomplete: "null",
      bgColor: "white",
      hideDetails: "auto",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      bgColor: "white",
      hideDetails: "auto",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VFileInput: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      prependIcon: "",
      appendInnerIcon: "mdi-paperclip",
      hideDetails: "auto",
    },
    VCombobox: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VListItem: {
      minHeight: "45px",
    },
    VTooltip: {
      location: "top",
    },
    VSwitch: {
      color: "success",
      baseColor: "primary",
      density: "comfortable",
      hideDetails: "auto",
    },
    VBtn: {
      color: "primary",
      style: "text-transform: uppercase; font-weight: 800",
      variant: "flat",
    },
  },
})
