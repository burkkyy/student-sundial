import { Knex } from "knex"
import { QueryTypes, QueryOptionsWithType } from "@sequelize/core"

import db from "@/db/db-client"

type QueryOptions = Omit<QueryOptionsWithType<QueryTypes.SELECT>, "bind" | "type">

// TODO: fix types to show that it might return null
export async function knexQueryToSequelizeSelect<T extends object>(
  knexQuery: Knex.QueryBuilder,
  options: QueryOptions = {}
) {
  const { sql: knexSql, bindings } = knexQuery.toSQL().toNative()
  const { sql: sequelizeSql, bind } = knexSqlNativeToSequelizeQueryWithBind({
    sql: knexSql,
    bindings,
  })
  return db.query<T>(sequelizeSql, {
    ...options,
    bind,
    type: QueryTypes.SELECT,
  })
}

/**
 * Note siganture is chosen so you can pass knexQuery.toSQL().toNative() directly
 *
 * Currently only tested with MSSQL dialect
 *
 * @param sqlWithKnexBindings knexQuery.toSQL().toNative().sql
 * @param bindings knexQuery.toSQL().toNative().bindings
 * @returns { sql: string, bind: unknown[] } in Sequelize format
 */
export function knexSqlNativeToSequelizeQueryWithBind({
  sql: sqlWithKnexBindings,
  bindings,
}: {
  sql: string
  bindings: readonly unknown[]
}): { sql: string; bind: unknown[] } {
  let sqlWithSequelizeBindings = sqlWithKnexBindings
  // converts "@p0" to "$1", "@p1" to "$2", etc.
  bindings.forEach((_, i) => {
    const pattern = new RegExp(`@p${i}\\b`, "g")
    sqlWithSequelizeBindings = sqlWithSequelizeBindings.replace(pattern, `$${i + 1}`)
  })

  const mutableBindings = [...bindings]

  return {
    sql: sqlWithSequelizeBindings,
    bind: mutableBindings,
  }
}
