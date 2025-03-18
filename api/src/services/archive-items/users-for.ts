import { ArchiveItem, User, UserPermission } from "@/models"
import BaseService from "@/services/base-service"
import { Op } from "@sequelize/core"

export class UsersFor extends BaseService {
  constructor(private item: ArchiveItem) {
    super()
  }

  async perform(): Promise<User[]> {
    const categories = (await this.item.categories?.map((c) => c.id)) ?? []
    const sourceId = this.item.sourceId
    const archiveItemId = this.item.id

    const orClauses = {
      archiveItemId: archiveItemId,
    } as { sourceId?: number; categoryId: { [Op.in]: number[] }; archiveItemId: number }

    if (sourceId != null) orClauses.sourceId = sourceId
    if (categories.length > 0) orClauses.categoryId = { [Op.in]: categories }

    const permissions = await UserPermission.findAll({
      where: { [Op.or]: orClauses },
    })

    const userIds = permissions.map((p) => p.userId).filter((id) => id !== null)

    return User.findAll({
      where: {
        id: { [Op.in]: userIds },
      },
    })
  }
}

export default UsersFor
