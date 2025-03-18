import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Retention } from "@/models"
import BaseService from "@/services/base-service"

export type RetentionCreationAttributes = Partial<CreationAttributes<Retention>>

export class CreateService extends BaseService {
  constructor(private attributes: RetentionCreationAttributes) {
    super()
  }

  async perform(): Promise<Retention> {
    const { name, retentionDate, isDefault, expireSchedule, expireAction, ...optionalAttributes } =
      this.attributes
    let { retentionDays } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    if (isNil(isDefault)) {
      throw new Error("Default is required")
    }

    if (isNil(expireSchedule)) {
      throw new Error("Expiration Schedule is required")
    }

    if (isNil(expireAction)) {
      throw new Error("Expiration Action is required")
    }

    if (isDefault === true) {
      await Retention.update({ isDefault: false }, { where: {} })
    }

    if (isNil(retentionDate) && isNil(retentionDays)) {
      throw new Error("A retention value is required")
    } else {
      if (!isNil(retentionDate) && !isNil(retentionDays)) retentionDays = null
    }

    const retention = await Retention.create({
      ...optionalAttributes,
      name,
      retentionDate,
      retentionDays,
      isDefault,
      expireSchedule,
      expireAction,
    })

    return retention
  }
}

export default CreateService
