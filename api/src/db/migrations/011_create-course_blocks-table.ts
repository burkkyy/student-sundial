import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("course_blocks", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("course_id").unsigned().notNullable()
    table.integer("block_id").unsigned().notNullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("course_id").references("courses.id")
    table.foreign("block_id").references("blocks.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("course_blocks")
}
