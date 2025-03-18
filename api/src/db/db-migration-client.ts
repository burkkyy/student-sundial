import path from "path"

import knex, { Knex } from "knex"
import { isEmpty, isNil, merge } from "lodash"

import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_TRUST_SERVER_CERTIFICATE,
  NODE_ENV,
} from "@/config"

if (isEmpty(DB_DATABASE)) throw new Error("database name is unset.")
if (isEmpty(DB_USERNAME)) throw new Error("database username is unset.")
if (isEmpty(DB_PASSWORD)) throw new Error("database password is unset.")
if (isEmpty(DB_HOST)) throw new Error("database host is unset.")
if (isNil(DB_PORT) || isNaN(DB_PORT)) throw new Error("database port is unset.")

export function buildKnexConfig(options?: Knex.Config): Knex.Config {
  return merge(
    {
      client: "mssql",
      connection: {
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        port: DB_PORT,
        options: {
          encrypt: true,
          trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE,
        },
      },
      migrations: {
        directory: path.resolve(__dirname, "./migrations"),
        extension: "ts",
        stub: path.resolve(__dirname, "./templates/sample-migration.ts"),
      },
      seeds: {
        directory: path.resolve(__dirname, `./seeds/${NODE_ENV}`),
        extension: "ts",
        stub: path.resolve(__dirname, "./templates/sample-seed.ts"),
      },
    },
    options
  )
}

const config = buildKnexConfig()
const dbMigrationClient = knex(config)

export default dbMigrationClient
