import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("courses", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 100).notNullable()
    table.dateTime("start_on").notNullable()
    table.dateTime("end_on").notNullable()
    table.string("description", 100).nullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("courses")
}
