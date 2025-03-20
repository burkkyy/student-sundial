import express, { Request, Response } from "express"
import { join } from "path"

import { NODE_ENV } from "@/config"
import db from "@/db/db-client"
import { logger } from "@/utils/logger"

export class Migrator {
  readonly migrationRouter

  constructor() {
    if (NODE_ENV == "production") {
      logger.warn("Running migration controller in production!!!")
    }
    this.migrationRouter = express.Router()

    this.migrationRouter.get("/", async (_req: Request, res: Response) => {
      return res.json({ data: await this.listMigrations() })
    })

    this.migrationRouter.get("/up", async (_req: Request, res: Response) => {
      try {
        await this.migrateUp()
      } catch (err) {
        logger.error(err)
      }
      return res.json({ data: await migrator.listMigrations() })
    })

    this.migrationRouter.get("/down", async (_req: Request, res: Response) => {
      try {
        await this.migrateDown()
      } catch (err) {
        logger.error(err)
      }
      return res.json({ data: await this.listMigrations() })
    })

    this.migrationRouter.get("/seed", async (_req: Request, res: Response) => {
      try {
        await this.seedUp()
      } catch (err) {
        logger.error(err)
      }
      return res.json({ data: "Seeding" })
    })
  }

  listMigrations() {
    return db.migrate.list({ directory: join(__dirname, "migrations") })
  }

  async migrateUp() {
    logger.warn("-------- MIGRATE UP ---------")
    return db.migrate.up({ directory: join(__dirname, "migrations") })
  }

  async migrateDown() {
    logger.warn("-------- MIGRATE DOWN ---------")
    return db.migrate.down({ directory: join(__dirname, "migrations") })
  }

  async migrateLatest() {
    logger.warn("-------- MIGRATE LATEST ---------")
    return db.migrate.latest({ directory: join(__dirname, "migrations") })
  }

  async seedUp() {
    logger.warn("-------- SEED UP ---------")
    return db.seed.run({ directory: join(__dirname, "seeds", NODE_ENV) })
  }
}
const migrator = new Migrator()

export default migrator
