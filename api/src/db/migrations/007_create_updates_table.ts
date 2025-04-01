import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("updates", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").unsigned().notNullable()
    table.integer("block_id").unsigned().notNullable()
    table.integer("course_task_id").unsigned().notNullable()
    table.string("description", 100).nullable()
    table.string("message", 100).nullable()
    table.string("action", 100).nullable()

    table.foreign("user_id").references("users.id")
    table.foreign("block_id").references("blocks.id")
    table.foreign("course_task_id").references("course_tasks.id")

    table.timestamps(true, true)
    table.datetime("deleted_at")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("updates")
}
