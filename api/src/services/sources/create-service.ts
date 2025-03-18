import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Source } from "@/models"
import BaseService from "@/services/base-service"

export type SourceCreationAttributes = Partial<CreationAttributes<Source>>

export class CreateService extends BaseService {
  constructor(private attributes: SourceCreationAttributes) {
    super()
  }

  async perform(): Promise<Source> {
    const { name, ...optionalAttributes } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    const source = await Source.create({
      ...optionalAttributes,
      name,
    })

    return source
  }
}

export default CreateService
