import { Sequelize, Options } from "@sequelize/core"
import { MariaDbDialect } from "@sequelize/mariadb"

import { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } from "@/config"

if (MYSQL_DATABASE === undefined) throw new Error("database name is unset.")
if (MYSQL_USERNAME === undefined) throw new Error("database username is unset.")
if (MYSQL_PASSWORD === undefined) throw new Error("database password is unset.")
if (MYSQL_HOST === undefined) throw new Error("database host is unset.")
if (MYSQL_PORT === undefined) throw new Error("database port is unset.")

// See https://sequelize.org/docs/v7/databases/mariadb/
export const SEQUELIZE_CONFIG: Options<MariaDbDialect> = {
  dialect: MariaDbDialect,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  host: MYSQL_HOST,
  //logging: NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true, // default - explicit for clarity.
    paranoid: true, // adds deleted_at column
  },
}

const db = new Sequelize(SEQUELIZE_CONFIG)

export default db
