export type ThemeTypes = {
  name: string
  dark: boolean
  variables?: object
  colors: {
    background: string
    surface: string
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    info: string
    "on-background": string
    "on-surface": string
    "on-primary": string
    "on-secondary": string
    "on-success": string
    "on-warning": string
    "on-error": string
    "on-info": string

    "header-bar-color": string
    "breadcrumb-bar-color"?: string
  }
}

const STUDENT_SUNDIAL_THEME: ThemeTypes = {
  name: "STUDENT_SUNDIAL_THEME",
  dark: false,
  variables: {
    "border-color": "#e5eaef",
    "app-bar-color": "#ff0066",
  },
  colors: {
    background: "#EDF8FE",
    surface: "#FFFFFF",
    primary: "#1274A9", // PRIMARY GREEN
    secondary: "#7287A4",
    success: "#96C951", // PRIMARY GREEN
    warning: "#EFB71D", // ALT COLOUR 3
    error: "#BE2642", // ACCENT COLOUR 2
    info: "#67C8CC", // ALT COLOUR 1
    "on-background": "#222222",
    "on-surface": "#222222",
    "on-primary": "#ffffff",
    "on-secondary": "#222222",
    "on-success": "#222222",
    "on-warning": "#222222",
    "on-error": "#ffffff",
    "on-info": "#222222",

    "header-bar-color": "#1274A9",
    "breadcrumb-bar-color": "#D5E9BA",
  },
}
export { STUDENT_SUNDIAL_THEME }
