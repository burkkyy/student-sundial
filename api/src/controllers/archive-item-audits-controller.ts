import logger from "@/utils/logger"
import { ArchiveItemAudit } from "@/models"
import { ArchiveItemAuditsPolicy } from "@/policies"
import BaseController from "@/controllers/base-controller"
import { IndexSerializer } from "@/serializers/archive-item-audits"

export class ArchiveItemAuditsController extends BaseController<ArchiveItemAudit> {
  async index() {
    try {
      const where = this.buildWhere({ archiveItemId: this.params.archiveItemId })
      const scopes = this.buildFilterScopes()
      const scopedItems = ArchiveItemAuditsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedItems.count({ where })
      const archiveItems = await scopedItems.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["user"],
        order: [["createdAt", "DESC"]],
      })

      const serializedItems = IndexSerializer.perform(archiveItems)
      return this.response.json({
        archiveItemAudits: serializedItems,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching archive items audits" + error)
      return this.response.status(400).json({
        message: `Error fetching archive items audits: ${error}`,
      })
    }
  }
}

export default ArchiveItemAuditsController
