import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("archive_item_files", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("archive_item_id").notNullable().references("id").inTable("archive_items")
    table.string("bucket", 1000).nullable()
    table.string("original_key", 2000).notNullable()
    table.string("original_file_name", 1000).notNullable()
    table.string("original_mime_type", 1000).notNullable()
    table.bigInteger("original_file_size").notNullable()
    table.string("pdf_key", 2000).nullable()
    table.string("pdf_file_name", 1000).nullable()
    table.string("pdf_mime_type", 1000).nullable()
    table.bigInteger("pdf_file_size").nullable()
    table.text("comment").nullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["bucket", "original_key"], {
      indexName: "original_key_bucket_unique",
      predicate: knex.whereNull("deleted_at"),
    })
    table.unique(["bucket", "pdf_key"], {
      indexName: "pdf_key_bucket_unique",
      predicate: knex.whereRaw("deleted_at IS NULL AND pdf_key IS NOT NULL"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("archive_item_files")
}
