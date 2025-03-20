import path from "path"
import knex from "knex"

import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USERNAME,
  NODE_ENV,
} from "@/config"

if (MYSQL_DATABASE === undefined) throw new Error("database name is unset.")
if (MYSQL_USERNAME === undefined) throw new Error("database username is unset.")
if (MYSQL_PASSWORD === undefined) throw new Error("database password is unset.")
if (MYSQL_HOST === undefined) throw new Error("database host is unset.")
if (MYSQL_PORT === undefined) throw new Error("database port is unset.")

export function buildKnexConfig(): knex.Knex.Config {
  return {
    client: "mysql",
    connection: {
      host: MYSQL_HOST,
      user: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: MYSQL_PORT,
      options: {
        encrypt: true,
        trustServerCertificate: NODE_ENV === "production" ? false : true,
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
  }
}

const config = buildKnexConfig()
const db = knex(config)

db.on("query", (query) => {
  if (NODE_ENV === "production") {
    console.log(`Executing: ${query.sql}`)
  } else if (NODE_ENV === "test") {
    // don't log anything
  } else {
    console.log(`Executing (default): ${query.sql} ${JSON.stringify(query.bindings)}`)
  }
})

export default db
