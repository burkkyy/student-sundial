import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Source } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const sources = [
    {
      name: "WRAP",
    },
  ]
  for (const attributes of sources) {
    let item = await Source.findOne({
      where: {
        name: attributes.name,
      },
    })
    if (isNil(item)) {
      item = await Source.create(attributes)
      logger.debug("Source created:", item.dataValues)
    } else {
      await item.update(attributes)
      logger.debug("Source updated:", item.dataValues)
    }
  }
}
