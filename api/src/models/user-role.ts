import { isEmpty } from "lodash"

import db from "@/db/db-client"
import logger from "@/utils/logger"

import { User } from "./user"

export enum RoleTypes {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  PROFESSOR = "PROFESSOR",
  STUDENT = "STUDENT",
  USER = "USER",
}

export interface UserRoleAttributes {
  id: number
  userId: number
  role: RoleTypes
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class UserRole {
  id: number
  userId: number
  role: RoleTypes
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null

  constructor(data: UserRoleAttributes) {
    this.id = data.id
    this.userId = data.userId
    this.role = data.role
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
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

  static async findAll(): Promise<User[]> {
    const rows = await db("users").select("*")

    if (isEmpty(rows)) {
      logger.warn("No users where found")
      return []
    }

    return rows.map((row) => new User(row))
  }
}

export default UserRole
