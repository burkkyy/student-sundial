import { isEmpty, isNil, isUndefined } from "lodash"

import db from "@/db/db-client"
import logger from "@/utils/logger"

import UserRole, { RoleTypes } from "@/models/user-role"

export interface UserAttributes {
  id: number
  email: string
  auth_subject: string
  first_name?: string | null
  last_name?: string | null
  display_name?: string | null
  title?: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
  roles?: UserRole[] // maybe shouldnt be here...
}

export type UserWhereOptions = {
  id?: number
  email?: string
  auth_subject?: string
}

export type UserQueryOptions = {
  where?: UserWhereOptions
}

export class User {
  id: number
  email: string
  auth_subject: string
  first_name?: string | null
  last_name?: string | null
  display_name?: string | null
  title?: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  // associations
  roles?: UserRole[]

  constructor(attributes: UserAttributes) {
    this.id = attributes.id
    this.email = attributes.email
    this.auth_subject = attributes.auth_subject
    this.first_name = attributes.first_name
    this.last_name = attributes.last_name
    this.display_name = attributes.display_name
    this.title = attributes.title
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at

    this.roles = attributes.roles // maybe shouldnt be here...
  }

  get roleTypes(): RoleTypes[] {
    return this.roles?.map(({ role }) => role) || []
  }

  get isSystemAdmin(): boolean {
    return this.roleTypes.includes(RoleTypes.SYSTEM_ADMIN)
  }

  get isProfessor(): boolean {
    return this.roleTypes.includes(RoleTypes.PROFESSOR)
  }

  get isStudent(): boolean {
    return this.roleTypes.includes(RoleTypes.STUDENT)
  }

  static async findByPk(id: number): Promise<User> {
    const rows = await db("users").select("*").where("id", id)

    if (isEmpty(rows)) {
      logger.error(`User with id ${id} not found`)
      throw new Error("User not found")
    }

    const buildUser = new User(rows[0])

    return buildUser
  }

  static async findAll(params?: UserQueryOptions): Promise<User[]> {
    let rows = []

    if (isUndefined(params?.where)) {
      rows = await db("users").select("*")
    } else {
      rows = await db("users").select("*").where(params.where)
    }

    if (isEmpty(rows)) {
      logger.warn("No users where found")
      return []
    }

    return rows.map((row) => new User(row))
  }

  static async findOne(params: UserQueryOptions): Promise<User | null> {
    if (isNil(params.where)) return null

    const row = await db("users").select("*").where(params.where).first()

    if (isNil(row)) return null

    const foundUser = new User(row)

    return foundUser
  }

  async fetchRoles(): Promise<void> {
    const roles = await db("user_roles").select("*").where({ user_id: this.id })
    this.roles = roles as UserRole[]
  }

  static async create(attributes: Partial<UserAttributes>): Promise<User> {
    logger.info("USER CREATE ", attributes)

    const [createdId] = await db("users").insert(attributes)

    if (isNil(createdId)) {
      logger.error("failed to create user with attributes: ", attributes)
      throw new Error("Failed to create user")
    }

    const createdUser = await this.findByPk(createdId)

    return createdUser
  }

  async update(attributes: Partial<UserAttributes>): Promise<void> {
    logger.info("USER UPDATE", attributes)
    const row = await db("users").where({ id: this.id }).update(attributes)

    if (isNil(row)) {
      logger.error(`failed to update user with id: ${this.id} with attributes: `, attributes)
      throw new Error("Failed to update user")
    }

    Object.assign(this, row)
  }

  async destroy(): Promise<void> {
    throw new Error("Not Implemented")
  }

  async sync(): Promise<void> {
    await this.fetchRoles()
  }
}

export default User
