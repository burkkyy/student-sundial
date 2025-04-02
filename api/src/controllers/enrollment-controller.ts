import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Enrollment } from "@/models"

export class EnrollmentsController extends BaseController {
  async index() {
    try {
      const enrollments = await Enrollment.findAll()

      return this.response.json({
        enrollments,
        totalCount: enrollments.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching enrollments: ${error}`,
      })
    }
  }

  async show() {
    try {
      const enrollment = await this.loadEnrollment()

      if (isNil(enrollment)) {
        return this.response.status(404).json({ message: "Enrollment not found" })
      }

      return this.response.json({ enrollment })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching enrollments: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newEnrollment = await Enrollment.create(this.request.body)
      return this.response.status(201).json({ enrollment: newEnrollment })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Enrollment creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const enrollment = await this.loadEnrollment()

      if (isNil(enrollment)) {
        return this.response.status(404).json({ message: "Enrollment not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newEnrollment = await enrollment.update(this.request.body)
      return this.response.status(200).json({ enrollment: newEnrollment })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Enrollment update ${error}` })
    }
  }

  async destroy() {
    try {
      const enrollment = await this.loadEnrollment()

      if (isNil(enrollment)) {
        return this.response.status(404).json({ message: "Enrollment not found." })
      }

      // policy here to check if autherized to delete this enrollment?
      await enrollment.destroy()
      return this.response.status(204).json({ message: "Enrollment deleted" })
    } catch (error) {
      logger.error(error)
      return this.response
        .status(422)
        .json({ message: `Failed to delete enrollment. Error: ${error}` })
    }
  }

  private async loadEnrollment(): Promise<Enrollment | null> {
    const id = Number(this.params.enrollmentId)

    if (isNil(id)) {
      throw new Error("Invalid enrollmentId param passed")
    }

    const enrollment = await Enrollment.findByPk(id)

    return enrollment
  }
}

export default EnrollmentsController
