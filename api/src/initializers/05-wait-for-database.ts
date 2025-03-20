import knex, { type Knex } from "knex"
import { NODE_ENV } from "@/config"
import { logger } from "@/utils/logger"
import { buildKnexConfig } from "@/db/db-client"

const dbConfig = buildKnexConfig() as Knex.Config & {
  connection: { user: string; database: string }
}

const INTERVAL_SECONDS = 5
const TIMEOUT_SECONDS = 5
const RETRIES = 3
const START_PERIOD_SECONDS = 10

function checkHealth(dbLegacy: Knex, timeoutSeconds: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Connection timeout")), timeoutSeconds * 1000)
    dbLegacy
      .raw("SELECT 1")
      .then(() => {
        clearTimeout(timer)
        resolve(null)
      })
      .catch(reject)
  })
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export async function waitForDatabase({
  intervalSeconds = INTERVAL_SECONDS,
  timeoutSeconds = TIMEOUT_SECONDS,
  retries = RETRIES,
  startPeriodSeconds = NODE_ENV === "test" ? 0 : START_PERIOD_SECONDS,
}: {
  intervalSeconds?: number
  timeoutSeconds?: number
  retries?: number
  startPeriodSeconds?: number
} = {}): Promise<void> {
  if (NODE_ENV === "production") {
    logger.info(
      "Falling back to local database credentials because production database sa:master credentials are not available."
    )
  } else {
    dbConfig.connection.user = "root" // default user that should always exist
    dbConfig.connection.database = "" // no db by default
  }

  const dbMigrationClient = knex(dbConfig)

  await sleep(startPeriodSeconds)

  for (let i = 0; i < retries; i++) {
    try {
      await checkHealth(dbMigrationClient, timeoutSeconds)
      logger.info("Database connection successful.")
      return
    } catch (error) {
      logger.error(`Database connection failed, retrying... ${error}`)
      await sleep(intervalSeconds)
    }
  }
  throw new Error("Failed to connect to the database after retries.")
}

export default waitForDatabase
