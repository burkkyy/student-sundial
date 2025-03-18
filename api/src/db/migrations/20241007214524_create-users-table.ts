import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").notNullable().primary()
    table.string("email", 100).notNullable()
    table.string("auth0_subject", 100).notNullable()
    table.string("first_name", 100).notNullable()
    table.string("last_name", 100).notNullable()
    table.string("display_name", 200).notNullable()
    table.string("roles", 255).notNullable()
    table.string("title", 100)
    table.string("department", 100)
    table.string("division", 100)
    table.string("branch", 100)
    table.string("unit", 100)
    table.specificType("deactivated_at", "DATETIME2(0)")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")
    
    table.unique(["email"], {
      indexName: "users_auth0_subject_unique",
      predicate: knex.whereNull("deleted_at"),
    })
    table.unique(["auth0_subject"], {
      indexName: "users_email_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
