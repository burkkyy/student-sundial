import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { CourseTask } from "@/models"

export class CourseTasksController extends BaseController {
  async index() {
    try {
      const courseTasks = await CourseTask.findAll()

      return this.response.json({
        courseTasks,
        totalCount: courseTasks.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching courseTasks: ${error}`,
      })
    }
  }

  async show() {
    try {
      const courseTask = await this.loadCourseTask()

      if (isNil(courseTask)) {
        return this.response.status(404).json({ message: "CourseTask not found" })
      }

      return this.response.json({ courseTask })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching courseTasks: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newCourseTask = await CourseTask.create(this.request.body)
      return this.response.status(201).json({ courseTask: newCourseTask })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `CourseTask creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const courseTask = await this.loadCourseTask()

      if (isNil(courseTask)) {
        return this.response.status(404).json({ message: "CourseTask not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newCourseTask = await courseTask.update(this.request.body)
      return this.response.status(200).json({ courseTask: newCourseTask })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `CourseTask update ${error}` })
    }
  }

  async destroy() {
    try {
      const courseTask = await this.loadCourseTask()

      if (isNil(courseTask)) {
        return this.response.status(404).json({ message: "CourseTask not found." })
      }

      // policy here to check if autherized to delete this courseTask?
      await courseTask.destroy()
      return this.response.status(204).json({ message: "CourseTask deleted" })
    } catch (error) {
      logger.error(error)
      return this.response
        .status(422)
        .json({ message: `Failed to delete courseTask. Error: ${error}` })
    }
  }

  private async loadCourseTask(): Promise<CourseTask | null> {
    const id = Number(this.params.courseTaskId)

    if (isNil(id)) {
      throw new Error("Invalid courseTaskId param passed")
    }

    const courseTask = await CourseTask.findByPk(id)

    return courseTask
  }
}

export default CourseTasksController
