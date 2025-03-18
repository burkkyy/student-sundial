import dbMigrationClient from "@/db/db-migration-client"
import { logger } from "@/utils/logger"

type MigrationInfo = {
  file: string
  directory: string
}

async function runMigrations(): Promise<void> {
  const [_completedMigrations, pendingMigrations]: [MigrationInfo[], MigrationInfo[]] =
    await dbMigrationClient.migrate.list()

  if (pendingMigrations.length === 0) {
    logger.info("No pending migrations.")
    return
  }

  for (const { file, directory } of pendingMigrations) {
    logger.info(`Running migration: ${directory}/${file}`)
    try {
      await dbMigrationClient.migrate.up()
    } catch (error) {
      logger.error(`Error running migration: ${error}`, { error })
      throw error
    }
  }

  logger.info("All migrations completed successfully.")
}

export default runMigrations
