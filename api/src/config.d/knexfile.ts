import { Knex } from "knex"

import { DB_LEGACY_CONFIG } from "@/config"

const config: { [key: string]: Knex.Config } = {
  development: {
    ...DB_LEGACY_CONFIG,
  },
  test: {
    ...DB_LEGACY_CONFIG,
  },
  production: {
    ...DB_LEGACY_CONFIG,
  },
}

export default config
