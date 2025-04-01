import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("section_block_schedules", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("section_id").unsigned().notNullable()
    table.integer("block_id").unsigned().notNullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("section_id").references("sections.id")
    table.foreign("block_id").references("blocks.id")
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("section_block_schedules")
}
