import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
 await knex.schema.createTable("coursetask", function (table) {
    table.increments("id").notNullable().primary()
	table.string("due",100).notNullable()
	table.string("description",100).notNullable()
	table.integer("course_id",100).notNullable().foreign()
 }
}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("coursetask")
}
