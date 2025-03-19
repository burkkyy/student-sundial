import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  const someModel = await knex("table_name")
    .where({
      colName: "rowValue1",
    })
    .first()

  if (!someModel) {
    await knex("table_name").insert({
      colName: "rowValue1",
    })
  }
}
