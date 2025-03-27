import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {
await knex.schema.createTable("update", function (table) {
	table.increments("id").notNullable().primary(){
	table.string("created", 100).notNullable()
	table.string("description",100).notNullable()
	table.string("message",100).notNullable()
	table.string("action",100).notNullable()
	table.string("description",100).notNullable()
	table.integer("user_id",100).notNullable().foreign()
	table.integer("coursetask_id",100).notNullable().foreign()
	table.integer("block_id",100).notNullable().foreign()
	
	}
}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("update")
}
