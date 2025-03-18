import { scheduleJob } from "node-schedule"

import { APPLICATION_NAME } from "@/config"
import { PDFConverterJob } from "@/jobs"
import cache from "@/db/cache-client"
import logger from "@/utils/logger"

export async function startScheduler() {
  logger.info("Scheduler starting in " + APPLICATION_NAME)

  const c = await cache.getClient()

  if (c) await c.setValue("mj", ":te", 3000)

  const converter = new PDFConverterJob()

  scheduleJob(converter.name, converter.schedule, converter.run)
}
