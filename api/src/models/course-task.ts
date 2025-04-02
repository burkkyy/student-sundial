import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"
import { DateTime } from "luxon"

export interface CourseTaskAttributes {
  id: number
  course_id: number
  due_at: DateTime
  description: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type CourseTaskWhereOptions = {
  id?: number
}

export type CourseTaskQueryOptions = {
  where?: CourseTaskWhereOptions
}

export class CourseTask {
  id: number
  course_id: number
  due_at: DateTime
  description: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: CourseTaskAttributes) {
    this.id = attributes.id
    this.course_id = attributes.course_id
    this.due_at = attributes.due_at
    this.description = attributes.description
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<CourseTask> {
    const rows = await db("course_tasks").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`CourseTask with id ${id} not found`)
      throw new Error("CourseTask not found")
    }

    const buildCourseTask = new CourseTask(rows[0])

    return buildCourseTask
  }

  static async findAll(params?: CourseTaskQueryOptions): Promise<CourseTask[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("course_tasks").select("*")
    } else {
      rows = await db("course_tasks").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No course_tasks where found")
      return []
    }

    return rows.map((row) => new CourseTask(row))
  }

  static async findOne(params: CourseTaskQueryOptions): Promise<CourseTask | null> {
    if (isNil(params.where)) return null

    const row = await db("course_tasks").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundCourseTask = new CourseTask(row)

    return foundCourseTask
  }

  static async create(attributes: Partial<CourseTaskAttributes>): Promise<CourseTask> {
    logger.info("COURSE TASK CREATE ", attributes)

    const [createdId] = await db("course_tasks").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create course_task with attributes: ", attributes)
      throw new Error("Failed to create course_task")
    }

    const createdCourseTask = await this.findByPk(createdId)

    return createdCourseTask
  }

  async update(attributes: Partial<CourseTaskAttributes>): Promise<void> {
    logger.info("COURSE TASK UPDATE", attributes)
    const row = await db("course_tasks").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update course_task with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update course_task")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default CourseTask
