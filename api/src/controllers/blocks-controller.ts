import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Block } from "@/models"

export class BlocksController extends BaseController {
  async index() {
    try {
      const blocks = await Block.findAll()

      return this.response.json({
        blocks,
        totalCount: blocks.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching blocks: ${error}`,
      })
    }
  }

  async show() {
    try {
      const block = await this.loadBlock()

      if (isNil(block)) {
        return this.response.status(404).json({ message: "Block not found" })
      }

      return this.response.json({ block })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching blocks: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newBlock = await Block.create(this.request.body)
      return this.response.status(201).json({ block: newBlock })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Block creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const block = await this.loadBlock()

      if (isNil(block)) {
        return this.response.status(404).json({ message: "Block not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newBlock = await block.update(this.request.body)
      return this.response.status(200).json({ block: newBlock })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Block update ${error}` })
    }
  }

  async destroy() {
    try {
      const block = await this.loadBlock()

      if (isNil(block)) {
        return this.response.status(404).json({ message: "Block not found." })
      }

      // policy here to check if autherized to delete this block?
      await block.destroy()
      return this.response.status(204).json({ message: "Block deleted" })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Failed to delete block. Error: ${error}` })
    }
  }

  private async loadBlock(): Promise<Block | null> {
    const id = Number(this.params.blockId)

    if (isNil(id)) {
      throw new Error("Invalid blockId param passed")
    }

    const block = await Block.findByPk(id)

    return block
  }
}

export default BlocksController
