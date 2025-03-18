import { Op } from "@sequelize/core"

import { User, UserPermission } from "@/models"
import BaseService from "@/services/base-service"
import { isNil } from "lodash"

export type UserPermissionMergeAttributes = {
  user: User
  categoryIds?: number[]
  sourceIds?: number[]
}

export class MergeService extends BaseService {
  constructor(private attributes: UserPermissionMergeAttributes) {
    super()
  }

  async perform(): Promise<void> {
    const { user, categoryIds, sourceIds } = this.attributes

    if (!isNil(categoryIds)) {
      await UserPermission.destroy({ where: { userId: user.id, categoryId: { [Op.ne]: null } } })

      for (const categoryId of categoryIds) {
        await UserPermission.create({
          userId: user.id,
          categoryId,
          canViewAttachments: true,
        })
      }
    }

    if (!isNil(sourceIds)) {
      await UserPermission.destroy({ where: { userId: user.id, sourceId: { [Op.ne]: null } } })

      for (const sourceId of sourceIds) {
        await UserPermission.create({
          userId: user.id,
          sourceId,
          canViewAttachments: true,
        })
      }
    }
  }
}

export default MergeService
