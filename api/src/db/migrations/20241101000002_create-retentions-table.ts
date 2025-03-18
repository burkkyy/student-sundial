import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("retentions", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 255).notNullable()
    table.string("description", 2000).nullable()
    table.boolean("is_default").notNullable().defaultTo(false)
    table.string("expire_schedule", 50).notNullable()
    table.string("expire_action", 255).notNullable()
    table.integer("retention_days").nullable()
    table.specificType("retention_date", "DATETIME2(0)").nullable()

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
      indexName: "retentions_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("retentions")
}
