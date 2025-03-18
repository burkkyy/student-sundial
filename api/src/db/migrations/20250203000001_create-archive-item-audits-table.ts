import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("archive_item_audits", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").nullable().references("id").inTable("users")
    table.integer("archive_item_id").notNullable().references("id").inTable("archive_items")
    table.integer("archive_item_file_id").nullable().references("id").inTable("archive_item_files")
    table.string("action", 200).notNullable()
    table.string("description", 2000).nullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("archive_item_audits")
}
