import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Category } from "@/models"
import { CategoryPolicy } from "@/policies"
import { CreateService } from "@/services/categories"
import { IndexSerializer } from "@/serializers/categories"
import BaseController from "@/controllers/base-controller"

export class CategoriesController extends BaseController<Category> {
  cacheIndex = true
  cacheShow = true
  cacheDuration = 90
  cachePrefix = "categories-"

  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedCategories = CategoryPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedCategories.count({ where })
      const categories = await scopedCategories.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["retention"],
      })
      const serializedCategories = IndexSerializer.perform(categories)
      return this.cacheAndSendJson({
        categories: serializedCategories,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching categories" + error)
      return this.response.status(400).json({
        message: `Error fetching categories: ${error}`,
      })
    }
  }

  async show() {
    try {
      const category = await this.loadCategory()
      if (isNil(category)) {
        return this.response.status(404).json({
          message: "Category not found",
        })
      }

      const policy = this.buildPolicy(category)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this category",
        })
      }

      return this.cacheAndSendJson({ category, policy })
    } catch (error) {
      logger.error("Error fetching category" + error)
      return this.response.status(400).json({
        message: `Error fetching category: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create categories",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const category = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ category })
    } catch (error) {
      logger.error("Error creating category" + error)
      return this.response.status(422).json({
        message: `Error creating category: ${error}`,
      })
    }
  }

  async update() {
    try {
      const category = await this.loadCategory()
      if (isNil(category)) {
        return this.response.status(404).json({
          message: "Category not found",
        })
      }

      const policy = this.buildPolicy(category)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this category",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await category.update(permittedAttributes)
      return this.response.json({ category })
    } catch (error) {
      logger.error("Error updating category" + error)
      return this.response.status(422).json({
        message: `Error updating category: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const category = await this.loadCategory()
      if (isNil(category)) {
        return this.response.status(404).json({
          message: "Category not found",
        })
      }

      const policy = this.buildPolicy(category)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this category",
        })
      }

      await category.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error("Error deleting category" + error)
      return this.response.status(422).json({
        message: `Error deleting category: ${error}`,
      })
    }
  }

  private async loadCategory() {
    return Category.findByPk(this.params.id)
  }

  private buildPolicy(category: Category = Category.build()) {
    return new CategoryPolicy(this.currentUser, category)
  }
}

export default CategoriesController
