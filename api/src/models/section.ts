import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

export interface SectionAttributes {
  id: number
  name: string
  course_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type SectionWhereOptions = {
  id?: number
  name?: string
  course_id?: number
}

export type SectionQueryOptions = {
  where?: SectionWhereOptions
}

export class Section {
  id: number
  name: string
  course_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: SectionAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.course_id = attributes.course_id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<Section> {
    const rows = await db("sections").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`section with id ${id} not found`)
      throw new Error("section not found")
    }

    const buildsection = new Section(rows[0])

    return buildsection
  }

  static async findAll(params?: SectionQueryOptions): Promise<Section[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("sections").select("*")
    } else {
      rows = await db("sections").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No sections where found")
      return []
    }

    return rows.map((row) => new Section(row))
  }

  static async findOne(params: SectionQueryOptions): Promise<Section | null> {
    if (isNil(params.where)) return null

    const row = await db("sections").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundsection = new Section(row)

    return foundsection
  }

  static async create(attributes: Partial<SectionAttributes>): Promise<Section> {
    logger.info("section CREATE ", attributes)

    const [createdId] = await db("sections").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create section with attributes: ", attributes)
      throw new Error("Failed to create section")
    }

    const createdsection = await this.findByPk(createdId)

    return createdsection
  }

  async update(attributes: Partial<SectionAttributes>): Promise<void> {
    logger.info("section UPDATE", attributes)
    const row = await db("sections").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update section with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update section")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default Section
