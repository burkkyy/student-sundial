import { createLogger, format, transports } from "winston"

import { DEFAULT_LOG_LEVEL } from "@/config"

export const consoleLogger = createLogger({
  level: DEFAULT_LOG_LEVEL,
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
})

export const logger = consoleLogger

export default logger
