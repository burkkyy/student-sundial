import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

export interface TeachingAttributes {
  id: number
  user_id: number
  course_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type TeachingWhereOptions = {
  id?: number
}

export type TeachingQueryOptions = {
  where?: TeachingWhereOptions
}

export class Teaching {
  id: number
  user_id: number
  course_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: TeachingAttributes) {
    this.id = attributes.id
    this.user_id = attributes.user_id
    this.course_id = attributes.course_id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<Teaching> {
    const rows = await db("teachings").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`Teaching with id ${id} not found`)
      throw new Error("Teaching not found")
    }

    const buildTeaching = new Teaching(rows[0])

    return buildTeaching
  }

  static async findAll(params?: TeachingQueryOptions): Promise<Teaching[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("teachings").select("*")
    } else {
      rows = await db("teachings").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No teachings where found")
      return []
    }

    return rows.map((row) => new Teaching(row))
  }

  static async findOne(params: TeachingQueryOptions): Promise<Teaching | null> {
    if (isNil(params.where)) return null

    const row = await db("teachings").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundTeaching = new Teaching(row)

    return foundTeaching
  }

  static async create(attributes: Partial<TeachingAttributes>): Promise<Teaching> {
    logger.info("USER CREATE ", attributes)

    const [createdId] = await db("teachings").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create teaching with attributes: ", attributes)
      throw new Error("Failed to create teaching")
    }

    const createdTeaching = await this.findByPk(createdId)

    return createdTeaching
  }

  async update(attributes: Partial<TeachingAttributes>): Promise<void> {
    logger.info("USER UPDATE", attributes)
    const row = await db("teachings").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update teaching with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update teaching")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default Teaching
