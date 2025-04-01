import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
	await knex.schema.createTable("teaching", function (table) {
	table.increments("id").notNullable().primary()
	table.integer("user_id",100).notNullable().foreign()
	table.integer("course_id",100).notNullable().foreign()
	}
}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("teaching")
}
