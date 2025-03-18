import { Knex } from "knex"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import { ArchiveItem, ArchiveItemCategory, Category, Source } from "@/models"
import { ArchiveItemStatus, SecurityLevel } from "@/models/archive-item"

import logger from "@/utils/logger"

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
  const category2 = await Category.findOne({
    where: {
      name: "HPW HR",
    },
    rejectOnEmpty: true,
  })

  const archiveItemAttributes = {
    title: "Testing",
    status: ArchiveItemStatus.ACCEPTED,
    securityLevel: SecurityLevel.LOW,
    calculatedExpireDate: DateTime.now().plus({ days: 10 }).toJSDate(),
    expireAction: "Hide",
    retentionName: "Hide",
    tags: ["Finance", "Testing"],
    sourceId: source1.id,
    isDecision: false,
  }

  let archiveItem = await ArchiveItem.findOne({
    where: {
      sourceId: source1.id,
    },
  })

  if (isNil(archiveItem)) {
    archiveItem = await ArchiveItem.create(archiveItemAttributes)

    await ArchiveItemCategory.create({
      archiveItemId: archiveItem.id,
      categoryId: category1.id,
      setBySourceId: source1.id,
    })

    await ArchiveItemCategory.create({
      archiveItemId: archiveItem.id,
      categoryId: category2.id,
      setBySourceId: source1.id,
    })

    logger.debug("ArchiveItem created with categories.")
  } else {
    await archiveItem.update(archiveItemAttributes)
    logger.debug("ArchiveItem updated.")
  }

  // const inserted = await archiveItem.reload({ include: [{ model: Category, include: Retention }] })

  // item.

  /*  for (const attributes of categories) {
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
  } */
}
