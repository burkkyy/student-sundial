import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { SectionBlock } from "@/models"

export class SectionBlocksController extends BaseController {
  async index() {
    try {
      const sectionBlocks = await SectionBlock.findAll()

      return this.response.json({
        sectionBlocks,
        totalCount: sectionBlocks.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching sectionBlocks: ${error}`,
      })
    }
  }

  async show() {
    try {
      const sectionBlock = await this.loadSectionBlock()

      if (isNil(sectionBlock)) {
        return this.response.status(404).json({ message: "SectionBlock not found" })
      }

      return this.response.json({ sectionBlock })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching sectionBlocks: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newSectionBlock = await SectionBlock.create(this.request.body)
      return this.response.status(201).json({ sectionBlock: newSectionBlock })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `SectionBlock creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const sectionBlock = await this.loadSectionBlock()

      if (isNil(sectionBlock)) {
        return this.response.status(404).json({ message: "SectionBlock not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newSectionBlock = await sectionBlock.update(this.request.body)
      return this.response.status(200).json({ sectionBlock: newSectionBlock })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `SectionBlock update ${error}` })
    }
  }

  async destroy() {
    try {
      const sectionBlock = await this.loadSectionBlock()

      if (isNil(sectionBlock)) {
        return this.response.status(404).json({ message: "SectionBlock not found." })
      }

      // policy here to check if autherized to delete this sectionBlock?
      await sectionBlock.destroy()
      return this.response.status(204).json({ message: "SectionBlock deleted" })
    } catch (error) {
      logger.error(error)
      return this.response
        .status(422)
        .json({ message: `Failed to delete sectionBlock. Error: ${error}` })
    }
  }

  private async loadSectionBlock(): Promise<SectionBlock | null> {
    const id = Number(this.params.sectionBlockId)

    if (isNil(id)) {
      throw new Error("Invalid sectionBlockId param passed")
    }

    const sectionBlock = await SectionBlock.findByPk(id)

    return sectionBlock
  }
}

export default SectionBlocksController
