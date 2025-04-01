import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
	await knex.schema.createTable("courses", function (table) {
    table.increments("course_id").notNullable().primary()
    table.string("name",100).().notNullable()
    table.string("description", 100).notNullable()
	}

}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("courses")
}
