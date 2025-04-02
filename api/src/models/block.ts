import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"
import { DateTime } from "luxon"

export interface BlockAttributes {
  id: number
  start_time: DateTime
  end_time: DateTime
  start_date: Date
  end_date: Date
  location: string
  recurrence: string
  is_cancelled: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type BlockWhereOptions = {
  id?: number
}

export type BlockQueryOptions = {
  where?: BlockWhereOptions
}

export class Block {
  id: number
  start_time: DateTime
  end_time: DateTime
  start_date: Date
  end_date: Date
  location: string
  recurrence: string
  is_cancelled: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: BlockAttributes) {
    this.id = attributes.id
    this.start_time = attributes.start_time
    this.end_time = attributes.end_time
    this.start_date = attributes.start_date
    this.end_date = attributes.end_date
    this.location = attributes.location
    this.recurrence = attributes.recurrence
    this.is_cancelled = attributes.is_cancelled
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<Block> {
    const rows = await db("blocks").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`User with id ${id} not found`)
      throw new Error("User not found")
    }

    const buildUser = new Block(rows[0])

    return buildUser
  }

  static async findAll(params?: BlockQueryOptions): Promise<Block[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("blocks").select("*")
    } else {
      rows = await db("blocks").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No blocks where found")
      return []
    }

    return rows.map((row) => new Block(row))
  }

  static async findOne(params: BlockQueryOptions): Promise<Block | null> {
    if (isNil(params.where)) return null

    const row = await db("blocks").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundUser = new Block(row)

    return foundUser
  }

  static async create(attributes: Partial<BlockAttributes>): Promise<Block> {
    logger.info("USER CREATE ", attributes)

    const [createdId] = await db("blocks").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create block with attributes: ", attributes)
      throw new Error("Failed to create block")
    }

    const createdUser = await this.findByPk(createdId)

    return createdUser
  }

  async update(attributes: Partial<BlockAttributes>): Promise<void> {
    logger.info("USER UPDATE", attributes)
    const row = await db("blocks").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update block with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update block")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default Block
