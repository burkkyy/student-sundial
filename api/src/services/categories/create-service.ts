import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Category } from "@/models"
import BaseService from "@/services/base-service"

export type RetentionCreationAttributes = Partial<CreationAttributes<Category>>

export class CreateService extends BaseService {
  constructor(private attributes: RetentionCreationAttributes) {
    super()
  }

  async perform(): Promise<Category> {
    const { name, retentionId, ...optionalAttributes } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    if (isNil(retentionId)) {
      throw new Error("Retention is required")
    }

    const category = await Category.create({
      ...optionalAttributes,
      name,
      retentionId,
    })

    return category
  }
}

export default CreateService
