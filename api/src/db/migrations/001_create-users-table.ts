import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").notNullable().primary()
    table.string("email", 100).notNullable()
    table.string("auth_subject", 100).notNullable()
    table.string("first_name", 100).nullable()
    table.string("last_name", 100).nullable()
    table.string("display_name", 200).nullable()
    table.string("title", 100).nullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.unique(["email"], {
      indexName: "unique_users_email",
      predicate: knex.whereNull("deleted_at"),
    })

    table.unique(["auth_subject"], {
      indexName: "unique_users_auth_subject",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
