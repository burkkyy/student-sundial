import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("course_tasks", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("course_id").unsigned().notNullable()
    table.datetime("due_at").notNullable()
    table.string("description", 100).nullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("course_id").references("courses.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("course_tasks")
}
