import * as knex from "knex"

export async function up(knex: knex.Knex): Promise<void> {

}

export async function down(knex: knex.Knex): Promise<void> {
 await knex.schema.dropTable("")
}
