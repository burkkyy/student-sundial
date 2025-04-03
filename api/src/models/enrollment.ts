import { isEmpty, isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import db from "@/db/db-client"

export interface EnrollmentAttributes {
  id: number
  user_id: number
  course_id: number
  section_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type EnrollmentWhereOptions = {
  id?: number
}

export type EnrollmentQueryOptions = {
  where?: EnrollmentWhereOptions
}

export class Enrollment {
  id: number
  user_id: number
  course_id: number
  section_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: EnrollmentAttributes) {
    this.id = attributes.id
    this.user_id = attributes.user_id
    this.course_id = attributes.course_id
    this.section_id = attributes.section_id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<Enrollment> {
    const rows = await db("enrollments").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`Enrollment with id ${id} not found`)
      throw new Error("Enrollment not found")
    }

    const buildEnrollment = new Enrollment(rows[0])

    return buildEnrollment
  }

  static async findAll(params?: EnrollmentQueryOptions): Promise<Enrollment[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("enrollments").select("*")
    } else {
      rows = await db("enrollments").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No enrollments where found")
      return []
    }

    return rows.map((row) => new Enrollment(row))
  }

  static async findOne(params: EnrollmentQueryOptions): Promise<Enrollment | null> {
    if (isNil(params.where)) return null

    const row = await db("enrollments").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundEnrollment = new Enrollment(row)

    return foundEnrollment
  }

  static async create(attributes: Partial<EnrollmentAttributes>): Promise<Enrollment> {
    logger.info("ENTROLLMENT CREATE ", attributes)

    const [createdId] = await db("enrollments").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create enrollment with attributes: ", attributes)
      throw new Error("Failed to create enrollment")
    }

    const createdEnrollment = await this.findByPk(createdId)

    return createdEnrollment
  }

  async update(attributes: Partial<EnrollmentAttributes>): Promise<void> {
    logger.info("ENTROLLMENT UPDATE", attributes)
    const row = await db("enrollments").where({ id: this.id }).update(attributes)

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

export default Enrollment
