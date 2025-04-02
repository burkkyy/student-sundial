import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("sections", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 100).notNullable()
    table.integer("course_id").unsigned().notNullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("course_id").references("courses.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("sections")
}
