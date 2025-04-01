import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
 await knex.schema.createTable("block", function (table) {
    table.increments("id").notNullable().primary()
	table.string("location", 100).notNullable()
	table.string("start_time",100).notNullable()
	table.string("end_time", 100).notNullable()
	table.string("recurrence", 100).notNullable()
	table.string("start_date", 100).notNullable()
	table.string("end_date", 100).notNullable()
	table.boolean("is_cancelled", 100).notNullable()
}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("block")
}
