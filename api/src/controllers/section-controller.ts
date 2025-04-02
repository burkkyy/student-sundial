import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Section } from "@/models"

export class SectionsController extends BaseController {
  async index() {
    try {
      const sections = await Section.findAll()

      return this.response.json({
        sections,
        totalCount: sections.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching sections: ${error}`,
      })
    }
  }

  async show() {
    try {
      const section = await this.loadSection()

      if (isNil(section)) {
        return this.response.status(404).json({ message: "Section not found" })
      }

      return this.response.json({ section })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching sections: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newSection = await Section.create(this.request.body)
      return this.response.status(201).json({ section: newSection })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Section creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const section = await this.loadSection()

      if (isNil(section)) {
        return this.response.status(404).json({ message: "Section not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newSection = await section.update(this.request.body)
      return this.response.status(200).json({ section: newSection })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Section update ${error}` })
    }
  }

  async destroy() {
    try {
      const section = await this.loadSection()

      if (isNil(section)) {
        return this.response.status(404).json({ message: "Section not found." })
      }

      // policy here to check if autherized to delete this section?
      await section.destroy()
      return this.response.status(204).json({ message: "Section deleted" })
    } catch (error) {
      logger.error(error)
      return this.response
        .status(422)
        .json({ message: `Failed to delete section. Error: ${error}` })
    }
  }

  private async loadSection(): Promise<Section | null> {
    const id = Number(this.params.sectionId)

    if (isNil(id)) {
      throw new Error("Invalid sectionId param passed")
    }

    const section = await Section.findByPk(id)

    return section
  }
}

export default SectionsController
