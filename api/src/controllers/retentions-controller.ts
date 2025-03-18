import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Retention } from "@/models"
import { RetentionPolicy } from "@/policies"
import { CreateService } from "@/services/retentions"
import { IndexSerializer } from "@/serializers/retentions"
import BaseController from "@/controllers/base-controller"

export class RetentionsController extends BaseController<Retention> {
  cacheIndex = true
  cacheShow = true
  cacheDuration = 90
  cachePrefix = "retentions-"

  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedRetentions = RetentionPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedRetentions.count({ where })
      const retentions = await scopedRetentions.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedRetentions = IndexSerializer.perform(retentions)
      return this.cacheAndSendJson({
        retentions: serializedRetentions,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching retentions" + error)
      return this.response.status(400).json({
        message: `Error fetching retentions: ${error}`,
      })
    }
  }

  async show() {
    try {
      const retention = await this.loadRetention()
      if (isNil(retention)) {
        return this.response.status(404).json({
          message: "Retention not found",
        })
      }

      const policy = this.buildPolicy(retention)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this retention",
        })
      }

      return this.cacheAndSendJson({ retention, policy })
    } catch (error) {
      logger.error("Error fetching retention" + error)
      return this.response.status(400).json({
        message: `Error fetching retention: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create retentions",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const retention = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ retention })
    } catch (error) {
      logger.error("Error creating retention" + error)
      return this.response.status(422).json({
        message: `Error creating retention: ${error}`,
      })
    }
  }

  async update() {
    try {
      const retention = await this.loadRetention()
      if (isNil(retention)) {
        return this.response.status(404).json({
          message: "Retention not found",
        })
      }

      const policy = this.buildPolicy(retention)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this retention",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await retention.update(permittedAttributes)
      return this.response.json({ retention })
    } catch (error) {
      logger.error("Error updating retention" + error)
      return this.response.status(422).json({
        message: `Error updating retention: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const retention = await this.loadRetention()
      if (isNil(retention)) {
        return this.response.status(404).json({
          message: "Retention not found",
        })
      }

      const policy = this.buildPolicy(retention)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this retention",
        })
      }

      await retention.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error("Error deleting retention" + error)
      return this.response.status(422).json({
        message: `Error deleting retention: ${error}`,
      })
    }
  }

  private async loadRetention() {
    return Retention.findByPk(this.params.id)
  }

  private buildPolicy(retention: Retention = Retention.build()) {
    return new RetentionPolicy(this.currentUser, retention)
  }
}

export default RetentionsController
