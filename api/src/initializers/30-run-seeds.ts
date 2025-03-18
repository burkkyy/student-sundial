import { logger } from "@/utils/logger"
import dbMigrationClient from "@/db/db-migration-client"
import { User } from "@/models"

export async function runSeeds(): Promise<void> {
  if (process.env.SKIP_SEEDING_UNLESS_EMPTY === "true") {
    const count = await User.count({ logging: false })

    if (count > 0) {
      logger.warn("Skipping seeding as SKIP_SEEDING_UNLESS_EMPTY set, and data already seeded.")
      return
    }
  }

  try {
    await dbMigrationClient.seed.run()
  } catch (error) {
    logger.error(`Error running seeds: ${error}`, { error })
    throw error
  }

  return
}

export default runSeeds
