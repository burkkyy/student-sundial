import knex, { type Knex } from "knex"

import { MYSQL_DATABASE } from "@/config"
import { logger } from "@/utils/logger"
import { buildKnexConfig } from "@/db/db-client"

const dbConfig = buildKnexConfig() as Knex.Config & {
  connection: { user: string; database: string }
}

async function databaseExists(dbLegacy: Knex, databaseName: string): Promise<boolean> {
  const result = await dbLegacy.raw("SHOW DATABASES LIKE ?", [databaseName])
  return result[0].length > 0
}

async function createDatabase(): Promise<void> {
  dbConfig.connection.database = "" // no db by default
  const dbMigrationClient = knex(dbConfig)

  if (await databaseExists(dbMigrationClient, MYSQL_DATABASE)) return

  logger.warn(`Database ${MYSQL_DATABASE} does not exist: creating...`)
  await dbMigrationClient.raw(`CREATE DATABASE ${MYSQL_DATABASE}`).catch((error) => {
    logger.error("Failed to create database: " + error)
  })
  return
}

export default createDatabase
