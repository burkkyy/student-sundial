import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  knex.raw("SELECT 1")
  throw new Error("Not implemented")
}

export async function down(knex: knex.Knex): Promise<void> {
  knex.raw("SELECT 1")
  throw new Error("Not implemented")
}
