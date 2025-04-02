import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Teaching } from "@/models"

export class TeachingsController extends BaseController {
  async index() {
    try {
      const teachings = await Teaching.findAll()

      return this.response.json({
        teachings,
        totalCount: teachings.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching teachings: ${error}`,
      })
    }
  }

  async show() {
    try {
      const teaching = await this.loadTeaching()

      if (isNil(teaching)) {
        return this.response.status(404).json({ message: "Teaching not found" })
      }

      return this.response.json({ teaching })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching teachings: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newTeaching = await Teaching.create(this.request.body)
      return this.response.status(201).json({ teaching: newTeaching })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Teaching creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const teaching = await this.loadTeaching()

      if (isNil(teaching)) {
        return this.response.status(404).json({ message: "Teaching not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newTeaching = await teaching.update(this.request.body)
      return this.response.status(200).json({ teaching: newTeaching })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Teaching update ${error}` })
    }
  }

  async destroy() {
    try {
      const teaching = await this.loadTeaching()

      if (isNil(teaching)) {
        return this.response.status(404).json({ message: "Teaching not found." })
      }

      // policy here to check if autherized to delete this teaching?
      await teaching.destroy()
      return this.response.status(204).json({ message: "Teaching deleted" })
    } catch (error) {
      logger.error(error)
      return this.response
        .status(422)
        .json({ message: `Failed to delete teaching. Error: ${error}` })
    }
  }

  private async loadTeaching(): Promise<Teaching | null> {
    const id = Number(this.params.teachingId)

    if (isNil(id)) {
      throw new Error("Invalid teachingId param passed")
    }

    const teaching = await Teaching.findByPk(id)

    return teaching
  }
}

export default TeachingsController
