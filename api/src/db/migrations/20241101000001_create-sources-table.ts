import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sources", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 255).notNullable()
    table.string("description", 2000).nullable()
    table.string("contact_email", 255).nullable()
    table.string("referrers", 2000).nullable()
    table.string("redirects", 2000).nullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["name"], {
      indexName: "sources_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("sources")
}
