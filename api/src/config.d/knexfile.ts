import { Knex } from "knex"

import dbMigrationClient from "@/db/db-migration-client"

// Hoists config from db client
const config: { [key: string]: Knex.Config } = {
  development: {
    ...dbMigrationClient.client.config,
  },
  test: {
    ...dbMigrationClient.client.config,
  },
  production: {
    ...dbMigrationClient.client.config,
  },
}

export default config
