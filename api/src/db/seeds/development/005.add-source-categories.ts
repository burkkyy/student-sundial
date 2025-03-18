import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Category, Source } from "@/models"
import SourceCategory from "@/models/source-category"

export async function seed(_knex: Knex): Promise<void> {
  const source1 = await Source.findOne({
    where: {
      name: "WRAP",
    },
    rejectOnEmpty: true,
  })
  const category1 = await Category.findOne({
    where: {
      name: "HPW Finance",
    },
    rejectOnEmpty: true,
  })

  const categories = [
    {
      sourceId: source1.id,
      categoryId: category1.id,
    },
  ]
  for (const attributes of categories) {
    let item = await SourceCategory.findOne({
      where: {
        sourceId: attributes.sourceId,
        categoryId: attributes.categoryId,
      },
    })
    if (isNil(item)) {
      item = await SourceCategory.create(attributes)
      logger.debug("SourceCategory created:", item.dataValues)
    } else {
      await item.update(attributes)
      logger.debug("SourceCategory updated:", item.dataValues)
    }
  }
}
