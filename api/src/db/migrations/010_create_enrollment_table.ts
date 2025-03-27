import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
	await knex.schema.createTable("enrollment", function (table) {
	table.integer("user_id",100).notNullable().foreign()
	table.integer("course_id",100).notNullable().foreign()
	table.integer("section_id",100).notNullable().foreign()
	}
}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("enrollment")
}
