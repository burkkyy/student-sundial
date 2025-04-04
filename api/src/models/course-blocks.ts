import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

export interface CourseBlockAttributes {
  id: number
  course_id: number
  block_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type CourseBlockWhereOptions = {
  id?: number
}

export type CourseBlockQueryOptions = {
  where?: CourseBlockWhereOptions
}

export class CourseBlock {
  id: number
  course_id: number
  block_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: CourseBlockAttributes) {
    this.id = attributes.id
    this.course_id = attributes.course_id
    this.block_id = attributes.block_id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<CourseBlock> {
    const rows = await db("course_blocks").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`CourseBlock with id ${id} not found`)
      throw new Error("CourseBlock not found")
    }

    const buildCourseBlock = new CourseBlock(rows[0])

    return buildCourseBlock
  }

  static async findAll(params?: CourseBlockQueryOptions): Promise<CourseBlock[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("course_blocks").select("*")
    } else {
      rows = await db("course_blocks").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No course_blocks where found")
      return []
    }

    return rows.map((row) => new CourseBlock(row))
  }

  static async findOne(params: CourseBlockQueryOptions): Promise<CourseBlock | null> {
    if (isNil(params.where)) return null

    const row = await db("course_blocks").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundCourseBlock = new CourseBlock(row)

    return foundCourseBlock
  }

  static async create(attributes: Partial<CourseBlockAttributes>): Promise<CourseBlock> {
    logger.info("COURSEBLOCK CREATE ", attributes)

    const [createdId] = await db("course_blocks").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create enrollment with attributes: ", attributes)
      throw new Error("Failed to create enrollment")
    }

    const createdCourseBlock = await this.findByPk(createdId)

    return createdCourseBlock
  }

  async update(attributes: Partial<CourseBlockAttributes>): Promise<void> {
    logger.info("COURSEBLOCK UPDATE", attributes)
    const row = await db("course_blocks").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update enrollment with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update enrollment")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default CourseBlock
