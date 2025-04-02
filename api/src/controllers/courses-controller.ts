import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Course } from "@/models"

export class CoursesController extends BaseController {
  async index() {
    try {
      const courses = await Course.findAll()

      return this.response.json({
        courses,
        totalCount: courses.length,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching courses: ${error}`,
      })
    }
  }

  async show() {
    try {
      const course = await this.loadCourse()

      if (isNil(course)) {
        return this.response.status(404).json({ message: "Course not found" })
      }

      return this.response.json({ course })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching courses: ${error}`,
      })
    }
  }

  async create() {
    try {
      // policy here to only allow permitted attributes for create?
      const newCourse = await Course.create(this.request.body)
      return this.response.status(201).json({ course: newCourse })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Course creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const course = await this.loadCourse()

      if (isNil(course)) {
        return this.response.status(404).json({ message: "Course not found." })
      }

      // policy here to only allow permitted attributes to update?
      const newCourse = await course.update(this.request.body)
      return this.response.status(200).json({ course: newCourse })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Course update ${error}` })
    }
  }

  async destroy() {
    try {
      const course = await this.loadCourse()

      if (isNil(course)) {
        return this.response.status(404).json({ message: "Course not found." })
      }

      // policy here to check if autherized to delete this course?
      await course.destroy()
      return this.response.status(204).json({ message: "Course deleted" })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Failed to delete course. Error: ${error}` })
    }
  }

  private async loadCourse(): Promise<Course | null> {
    const id = Number(this.params.courseId)

    if (isNil(id)) {
      throw new Error("Invalid courseId param passed")
    }

    const course = await Course.findByPk(id)

    return course
  }
}

export default CoursesController
