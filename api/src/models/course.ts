import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

import { Block } from "@/models"

export interface CourseAttributes {
  id: number
  name: string
  description: string
  start_on: string
  end_on: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  blocks?: Block[]
}

export type CourseWhereOptions = {
  id?: number
  name?: string
}

export type CourseQueryOptions = {
  where?: CourseWhereOptions
}

export class Course {
  id: number
  name: string
  description: string
  start_on: string
  end_on: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null

  // associations
  blocks: Block[]

  constructor(attributes: CourseAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.description = attributes.description
    this.start_on = attributes.start_on
    this.end_on = attributes.end_on
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at

    this.blocks = attributes.blocks || [] // maybe shouldnt be here...
  }

  async fetchBlocks(): Promise<void> {
    const courseBlocks = await db("course_blocks").select("*").where({ course_id: this.id })

    for (const courseBlock of courseBlocks) {
      const row = await db("blocks").select("*").where({ id: courseBlock.block_id })
      const block = new Block(row[0])
      this.blocks.push(block)
    }
  }

  static async findByPk(id: number): Promise<Course> {
    const rows = await db("courses").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`Course with id ${id} not found`)
      throw new Error("Course not found")
    }

    const buildCourse = new Course(rows[0])

    return buildCourse
  }

  static async findAll(params?: CourseQueryOptions): Promise<Course[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("courses").select("*")
    } else {
      rows = await db("courses").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No courses where found")
      return []
    }

    return rows.map((row) => new Course(row))
  }

  static async findOne(params: CourseQueryOptions): Promise<Course | null> {
    if (isNil(params.where)) return null

    const row = await db("courses").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundCourse = new Course(row)

    return foundCourse
  }

  static async create(attributes: Partial<CourseAttributes>): Promise<Course> {
    logger.info("Course CREATE ", attributes)

    const [createdId] = await db("courses").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create Course with attributes: ", attributes)
      throw new Error("Failed to create Course")
    }

    const createdCourse = await this.findByPk(createdId)

    return createdCourse
  }

  async update(attributes: Partial<CourseAttributes>): Promise<void> {
    logger.info("Course UPDATE", attributes)
    const row = await db("courses").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update Course with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update Course")
    }

    Object.assign(this, row)
  }

  async sync(): Promise<void> {
    logger.info("Course SYNC")
    const row = await db("courses").where({ id: this.id }).update({
      name: this.name,
      description: this.description,
      start_on: this.start_on,
      end_on: this.end_on,
    })

    if (isNil(row)) {
      logger.error(`failed to update Course with id: ${this.id} with attributes: `)
      throw new Error("Failed to update Course")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default Course
