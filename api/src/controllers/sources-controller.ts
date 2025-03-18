import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Source } from "@/models"
import { SourcePolicy } from "@/policies"
import { CreateService } from "@/services/sources"
import { IndexSerializer } from "@/serializers/sources"
import BaseController from "@/controllers/base-controller"

export class SourcesController extends BaseController<Source> {
  cacheIndex = true
  cacheShow = true
  cacheDuration = 90
  cachePrefix = "sources-"

  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedSources = SourcePolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedSources.count({ where })
      const sources = await scopedSources.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedSources = IndexSerializer.perform(sources)
      return this.cacheAndSendJson({
        sources: serializedSources,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching sources" + error)
      return this.response.status(400).json({
        message: `Error fetching sources: ${error}`,
      })
    }
  }

  async show() {
    try {
      const source = await this.loadSource()
      if (isNil(source)) {
        return this.response.status(404).json({
          message: "Source not found",
        })
      }

      const policy = this.buildPolicy(source)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this source",
        })
      }

      return this.cacheAndSendJson({ source, policy })
    } catch (error) {
      logger.error("Error fetching source" + error)
      return this.response.status(400).json({
        message: `Error fetching source: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create sources",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const source = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ source })
    } catch (error) {
      logger.error("Error creating source" + error)
      return this.response.status(422).json({
        message: `Error creating source: ${error}`,
      })
    }
  }

  async update() {
    try {
      const source = await this.loadSource()
      if (isNil(source)) {
        return this.response.status(404).json({
          message: "Source not found",
        })
      }

      const policy = this.buildPolicy(source)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this source",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await source.update(permittedAttributes)
      return this.response.json({ source })
    } catch (error) {
      logger.error("Error updating source" + error)
      return this.response.status(422).json({
        message: `Error updating source: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const source = await this.loadSource()
      if (isNil(source)) {
        return this.response.status(404).json({
          message: "Source not found",
        })
      }

      const policy = this.buildPolicy(source)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this source",
        })
      }

      await source.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error("Error deleting source" + error)
      return this.response.status(422).json({
        message: `Error deleting source: ${error}`,
      })
    }
  }

  private async loadSource() {
    return Source.findByPk(this.params.id)
  }

  private buildPolicy(source: Source = Source.build()) {
    return new SourcePolicy(this.currentUser, source)
  }
}

export default SourcesController
