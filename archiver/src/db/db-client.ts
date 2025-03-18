import { Sequelize, Options } from "@sequelize/core"
import { MsSqlDialect } from "@sequelize/mssql"
import { isEmpty, isNil } from "lodash"

import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_TRUST_SERVER_CERTIFICATE,
} from "@/config"

if (isEmpty(DB_DATABASE)) throw new Error("database name is unset.")
if (isEmpty(DB_USERNAME)) throw new Error("database username is unset.")
if (isEmpty(DB_PASSWORD)) throw new Error("database password is unset.")
if (isEmpty(DB_HOST)) throw new Error("database host is unset.")
if (isNil(DB_PORT) || isNaN(DB_PORT)) throw new Error("database port is unset.")

// See https://sequelize.org/docs/v7/databases/mssql/
export const SEQUELIZE_CONFIG: Options<MsSqlDialect> = {
  dialect: MsSqlDialect,
  server: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  encrypt: true,
  authentication: {
    type: "default",
    options: {
      userName: DB_USERNAME,
      password: DB_PASSWORD,
    },
  },
  schema: "dbo", // default - explicit for clarity
  // Avoids need to have a signed certificate in development.
  trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE,
  logging: false, // NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true, // default - explicit for clarity.
    paranoid: true, // adds deleted_at column
  },
}

const db = new Sequelize(SEQUELIZE_CONFIG)

export default db
