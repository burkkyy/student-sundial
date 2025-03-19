import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
  await knex.schema.createTable("user_roles", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").unsigned().notNullable()
    table.string("role", 100).notNullable()

    table.timestamps(true, true)
    table.datetime("deleted_at")

    table.foreign("user_id").references("users.id")

    table.unique(["user_id", "role"], {
      indexName: "unique_roles_user_id_role",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("user_roles")
}
