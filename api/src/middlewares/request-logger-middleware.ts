import morgan from "morgan"

import logger from "@/utils/logger"

export const requestLoggerMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
)

export default requestLoggerMiddleware
