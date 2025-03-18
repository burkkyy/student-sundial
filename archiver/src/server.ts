import { API_PORT, APPLICATION_NAME } from "@/config"
import logger from "@/utils/logger"
import app from "@/app"
import { startScheduler } from "@/scheduler"

app.listen(API_PORT, async () => {
  logger.info(`${APPLICATION_NAME} API listenting on port ${API_PORT}`)
  await startScheduler()
})
