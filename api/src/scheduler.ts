import { scheduleJob } from "node-schedule"

import { JOB_PORT, APPLICATION_NAME } from "@/config"
import cache from "@/db/cache-client"
import logger from "@/utils/logger"

async function startScheduler() {
  logger.info("Scheduler starting in " + APPLICATION_NAME)

  const c = await cache.getClient()

  if (c) await c.setValue("mj", ":te")

  scheduleJob("testing", "* * * * *", () => {
    logger.info("Job Running " + new Date())
  })
}

if (require.main === module) {
  ;(async () => {
    try {
      await startScheduler()
      logger.info(`${APPLICATION_NAME} JOBS listenting on port ${JOB_PORT}`)
    } catch {
      logger.error("Failed to start scheduler!")
    }

    process.exit(0)
  })()
}
