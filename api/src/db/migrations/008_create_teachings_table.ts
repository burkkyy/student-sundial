import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("teachings", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").unsigned().notNullable()
    table.integer("course_id").unsigned().notNullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("user_id").references("users.id")
    table.foreign("course_id").references("courses.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("teachings")
}
