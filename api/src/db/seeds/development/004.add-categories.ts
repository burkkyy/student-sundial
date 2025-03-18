import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Category, Retention } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const ret1 = await Retention.findOne({
    where: {
      name: "Keep 10 days, then destroy",
    },
    rejectOnEmpty: true,
  })
  const ret2 = await Retention.findOne({
    where: {
      name: "Keep till December 31, 2024, then hide",
    },
    rejectOnEmpty: true,
  })

  const categories = [
    {
      name: "HPW Finance",
      retentionId: ret1.id,
      description: "",
    },
    {
      name: "HPW HR",
      retentionId: ret2.id,
      description: "",
    },
  ]
  for (const attributes of categories) {
    let item = await Category.findOne({
      where: {
        name: attributes.name,
      },
    })
    if (isNil(item)) {
      item = await Category.create(attributes)
      logger.debug("Retention created:", item.dataValues)
    } else {
      await item.update(attributes)
      logger.debug("Retention updated:", item.dataValues)
    }
  }
}
