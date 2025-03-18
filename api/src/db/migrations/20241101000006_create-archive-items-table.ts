import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("archive_items", function (table) {
    table.increments("id").notNullable().primary()
    table.boolean("is_decision").notNullable().defaultTo(false)
    table.string("decision_text", 255).nullable()
    table.string("retention_name", 255).notNullable()
    table.specificType("calculated_expire_date", "DATETIME2(0)").notNullable()
    table.specificType("override_expire_date", "DATETIME2(0)").nullable()
    table.string("expire_action", 255).notNullable()
    table.integer("source_id").nullable().references("id").inTable("sources")
    table.integer("user_id").nullable().references("id").inTable("users")
    // capture more user info (name, title, email, auth0Subject)
    // permalink (similar to WRAP slug - UUID / maybe include source/type)
    table.string("title", 2000).notNullable()
    table.text("description").nullable()
    table.text("summary").nullable()
    table.string("status", 100).notNullable()
    table.integer("security_level").notNullable()
    table.string("tags", 255).nullable()
    table
      .specificType("submitted_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.index(["title"], "archive_items_title")
    table.index(["status"], "archive_items_status")
    table.index(["is_decision"], "archive_items_is_decision")
    table.index(["calculated_expire_date"], "archive_items_calculated_expire_date")
    table.index(["override_expire_date"], "archive_items_override_expire_date")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("archive_items")
}
