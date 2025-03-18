import logger from "@/utils/logger"
import { ArchiveItem, ArchiveItemAudit, ArchiveItemFile, Category } from "@/models"
import { DecisionPolicy } from "@/policies"
import { IndexSerializer } from "@/serializers/decisions"
import BaseController from "@/controllers/base-controller"
import { CreateService } from "@/services/decisions"
import { isNil } from "lodash"
import { UsersFor } from "@/services/archive-items"

export class DecisionsController extends BaseController<ArchiveItem> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes(["DecisionsOnly"])
      const scopedItems = DecisionPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedItems.count({ where })
      const decisions = await scopedItems.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["user"],
      })
      const serializedItems = IndexSerializer.perform(decisions)
      return this.response.json({
        decisions: serializedItems,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching archive items" + error)
      return this.response.status(400).json({
        message: `Error fetching archive items: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create items",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)

      const archiveItem = await CreateService.perform({
        ...permittedAttributes,
        categoryIds: this.request.body.categories,
        files: this.request.body.files,
        currentUser: this.request.currentUser,
      })

      await ArchiveItemAudit.create({
        archiveItemId: archiveItem.id,
        action: "Created",
        userId: this.currentUser.id,
        description: `${this.currentUser.displayName} created decision`,
      })

      return this.response.status(201).json({ archiveItem })
    } catch (error) {
      logger.error("Error creating archive item" + error)
      return this.response.status(422).json({
        message: `Error creating archive item: ${error}`,
      })
    }
  }

  async show() {
    try {
      const decision = await this.loadArchiveItem()
      if (isNil(decision)) {
        return this.response.status(404).json({
          message: "Decision not found",
        })
      }

      const policy = this.buildPolicy(decision)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this item",
        })
      }

      await ArchiveItemAudit.create({
        archiveItemId: decision.id,
        action: "Viewed Metadata",
        userId: this.currentUser.id,
        description: `${this.currentUser.displayName} viewed metadata`,
      })

      return this.response.json({ decision, policy })
    } catch (error) {
      logger.error("Error fetching item" + error)
      return this.response.status(400).json({
        message: `Error fetching item: ${error}`,
      })
    }
  }

  private async loadArchiveItem() {
    const item = await ArchiveItem.findByPk(this.params.id, {
      include: [{ model: Category }, { model: ArchiveItemFile }, "user"],
    })
    if (isNil(item)) return null

    const users = await UsersFor.perform(item)
    item.users = users
    return item
  }

  private buildPolicy(decision: ArchiveItem = ArchiveItem.build()) {
    return new DecisionPolicy(this.currentUser, decision)
  }
}

export default DecisionsController
