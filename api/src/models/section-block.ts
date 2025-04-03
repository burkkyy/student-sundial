import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

export interface SectionBlockAttributes {
  id: number
  section_id: number
  block_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type SectionBlockWhereOptions = {
  id?: number
}

export type SectionBlockQueryOptions = {
  where?: SectionBlockWhereOptions
}

export class SectionBlock {
  id: number
  section_id: number
  block_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: SectionBlockAttributes) {
    this.id = attributes.id
    this.section_id = attributes.section_id
    this.block_id = attributes.block_id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<SectionBlock> {
    const rows = await db("section_blocks").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`SectionBlock with id ${id} not found`)
      throw new Error("SectionBlock not found")
    }

    const buildSectionBlock = new SectionBlock(rows[0])

    return buildSectionBlock
  }

  static async findAll(params?: SectionBlockQueryOptions): Promise<SectionBlock[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("section_blocks").select("*")
    } else {
      rows = await db("section_blocks").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No section_blocks where found")
      return []
    }

    return rows.map((row) => new SectionBlock(row))
  }

  static async findOne(params: SectionBlockQueryOptions): Promise<SectionBlock | null> {
    if (isNil(params.where)) return null

    const row = await db("section_blocks").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundSectionBlock = new SectionBlock(row)

    return foundSectionBlock
  }

  static async create(attributes: Partial<SectionBlockAttributes>): Promise<SectionBlock> {
    logger.info("SECTION BLOCK CREATE ", attributes)

    const [createdId] = await db("section_blocks").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create sectionBlock with attributes: ", attributes)
      throw new Error("Failed to create sectionBlock")
    }

    const createdSectionBlock = await this.findByPk(createdId)

    return createdSectionBlock
  }

  async update(attributes: Partial<SectionBlockAttributes>): Promise<void> {
    logger.info("SECTION BLOCK UPDATE", attributes)
    const row = await db("section_blocks").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(
        `failed to update sectionBlock with id: ${this.id} with attributes: `,
        attributes
      )
      throw new Error("Failed to update sectionBlock")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default SectionBlock
