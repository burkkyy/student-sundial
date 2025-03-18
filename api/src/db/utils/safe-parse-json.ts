import { logger } from "@/utils/logger"

export function safeJsonParse(values: string): any[] {
  try {
    const lines = JSON.parse(values)
    if (Array.isArray(lines)) {
      return lines
    } else {
      logger.error("Parsed value is not an array.")
      return []
    }
  } catch (error) {
    logger.error(`Error parsing JSON: ${error}`, { error })
    return []
  }
}

export default safeJsonParse
