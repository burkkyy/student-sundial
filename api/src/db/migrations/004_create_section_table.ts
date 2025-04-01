import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {

	await knex.schema.createTable("section", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name",100).notNullable()
    table.integer("course_id").unsigned().notNullable().foreign()
	//table.integer("SectionBlockSchedule_id").unsigned().notNullable().foreign().
	
	}
	
}

export async function down(knex: knex.Knex): Promise<void> {
  await knex.schema.dropTable("section")
}
