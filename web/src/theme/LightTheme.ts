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
    background: "#ebf0f5",
    surface: "#FFFFFF",
    primary: "#0E5A8A", // PRIMARY Blue
    secondary: "#5A7CA3",
    success: "#4CAF50", // PRIMARY GREEN
    warning: "#FBC02D", // ALT COLOUR 3
    error: "#D32F2F", // ACCENT COLOUR 2
    info: "#3DB8D1", // ALT COLOUR 1
    "on-background": "#222222",
    "on-surface": "#222222",
    "on-primary": "#ffffff",
    "on-secondary": "#222222",
    "on-success": "#222222",
    "on-warning": "#222222",
    "on-error": "#ffffff",
    "on-info": "#222222",

    "header-bar-color": "#0D3A61",
    "breadcrumb-bar-color": "#b9d7ed",
  },
}
export { STUDENT_SUNDIAL_THEME }
