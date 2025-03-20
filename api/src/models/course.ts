import logger from "@/utils/logger"

export interface CourseAttributes {
  id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export type CourseWhereOptions = {
  id?: number
}

export type CourseQueryOptions = {
  where?: CourseWhereOptions
}

export class Course {
  id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: CourseAttributes) {
    this.id = attributes.id
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async findByPk(id: number): Promise<Course> {
    logger.info(`finding course with primary key: ${id}`)

    throw new Error("Not implemented")
  }

  static async findAll(params: CourseQueryOptions): Promise<Course[]> {
    logger.info("finding all courses with query params: ", params)

    throw new Error("Not implemented")
  }

  static async findOne(params: CourseQueryOptions): Promise<Course | null> {
    logger.info("finding one course with query params: ", params)

    throw new Error("Not implemented")
  }

  /**
   * Notice this function is static since its not per instance.
   *
   * ie
   * usage is User.create not user.create
   *
   * Controller should check if attributes are valid, we dont care here.
   * We just send it to the database
   */
  static async create(attributes: Partial<CourseAttributes>): Promise<Course> {
    logger.info("creating course with attributes: ", attributes)

    throw new Error("Not implemented")
  }

  async update(attributes: Partial<CourseAttributes>): Promise<void> {
    logger.info(`updating course with id: ${this.id} with attributes: `, attributes)

    throw new Error("Not implemented")
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }
}

export default Course
