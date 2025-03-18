import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_permissions", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").nullable().references("id").inTable("users")
    table.string("user_email", 100).nullable()
    table.integer("category_id").nullable().references("id").inTable("categories")
    table.integer("source_id").nullable().references("id").inTable("sources")
    table.integer("archive_item_id").nullable().references("id").inTable("archive_items")
    table.boolean("can_view_attachments").notNullable().defaultTo(false)

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
  await knex.schema.dropTable("user_permissions")
}
