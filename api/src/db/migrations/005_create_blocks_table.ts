import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("blocks", function (table) {
    table.increments("id").notNullable().primary()
    table.datetime("start_time").notNullable()
    table.datetime("end_time").notNullable()
    table.date("start_date").notNullable()
    table.date("end_date").notNullable()
    table.string("location", 100).nullable()
    table.string("recurrence", 100).nullable()
    table.boolean("is_cancelled").nullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("blocks")
}
