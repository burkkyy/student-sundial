import path from "path"

import { type Knex } from "knex"
import * as dotenv from "dotenv"

import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

export const NODE_ENV = process.env.NODE_ENV || "development"

let dotEnvPath
switch (process.env.NODE_ENV) {
  case "test":
    dotEnvPath = path.resolve(__dirname, "../.env.test")
    break
  case "production":
    dotEnvPath = path.resolve(__dirname, "../.env.production")
    break
  default:
    dotEnvPath = path.resolve(__dirname, "../.env.development")
}

dotenv.config({ path: dotEnvPath })

if (process.env.NODE_ENV !== "test") {
  console.log("Loading env: ", dotEnvPath)
}

export const API_PORT = process.env.API_PORT || "3000"

export const FRONTEND_URL = process.env.FRONTEND_URL || ""
export const AUTH0_DOMAIN = stripTrailingSlash(process.env.VITE_AUTH0_DOMAIN || "")
export const AUTH0_AUDIENCE = process.env.VITE_AUTH0_AUDIENCE
export const AUTH0_REDIRECT = process.env.VITE_AUTH0_REDIRECT || process.env.FRONTEND_URL || ""

export const APPLICATION_NAME = process.env.VITE_APPLICATION_NAME || ""

export const MYSQL_HOST = process.env.MYSQL_HOST || ""
export const MYSQL_USERNAME = process.env.MYSQL_USERNAME || ""
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ""
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || ""
export const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || "1433")

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"

if (MYSQL_DATABASE === undefined) throw new Error("database name is unset.")
if (MYSQL_USERNAME === undefined) throw new Error("database username is unset.")
if (MYSQL_PASSWORD === undefined) throw new Error("database password is unset.")
if (MYSQL_HOST === undefined) throw new Error("database host is unset.")
if (MYSQL_PORT === undefined) throw new Error("database port is unset.")

export const DB_LEGACY_CONFIG: Knex.Config = {
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
    directory: path.resolve(__dirname, "./db/migrations"),
    extension: "ts",
    stub: path.resolve(__dirname, "./db/templates/sample-migration.ts"),
  },
  seeds: {
    directory: path.resolve(__dirname, `./db/seeds/${NODE_ENV}`),
    extension: "ts",
    stub: path.resolve(__dirname, "./db/templates/sample-seed.ts"),
  },
}
