import { useTheme } from "vuetify"

/**
 * Useful for setting the color of a tabler icon.
 */
export function useVuetifyColorNameToHexValue(colorName: string) {
  const theme = useTheme()

  return theme.current.value.colors[colorName]
}

export default useVuetifyColorNameToHexValue
