import dbMigrationClient from "@/db/db-migration-client"
import { logger } from "@/utils/logger"

export async function runSeeds(): Promise<void> {
  if (process.env.SKIP_SEEDING_UNLESS_EMPTY === "true") {
    const count = await dbMigrationClient()
      .count({ count: "*" })
      .then((result) => {
        const count = result[0].count

        if (count === undefined) return 0
        if (typeof count === "number") return count

        return parseInt(count)
      })
      .catch(() => 0)

    if (count > 0) {
      logger.warn("Skipping seeding as SKIP_SEEDING_UNLESS_EMPTY set, and data already seeded.")
      return
    }
  }

  await dbMigrationClient.seed.run()
  return
}

export default runSeeds
