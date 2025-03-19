import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { User } from "@/models"

export class UsersController extends BaseController<User> {
  async index() {
    try {
      const where = this.buildWhere()

      const totalCount = await User.count({ where })
      const users = await User.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["roles"],
      })

      return this.response.json({
        users,
        totalCount,
      })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching users: ${error}`,
      })
    }
  }

  async show() {
    try {
      const user = await this.loadUser()

      if (isNil(user)) {
        return this.response.status(404).json({ message: "User not found" })
      }

      return this.response.json({ user })
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error fetching users: ${error}`,
      })
    }
  }

  async create() {
    try {
      // Could use policy here to only allow permitted attributes for create
      const newUser = await User.create(this.request.body)
      return this.response.status(201).json({ user: newUser })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `User creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const user = await this.loadUser()

      if (isNil(user)) {
        return this.response.status(404).json({ message: "User not found." })
      }

      // Could use policy here to only allow permitted attributes to update
      const newUser = await user.update(this.request.body)
      return this.response.status(200).json({ user: newUser })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `User update ${error}` })
    }
  }

  async destroy() {
    try {
      const user = await this.loadUser()

      if (isNil(user)) {
        return this.response.status(404).json({ message: "User not found." })
      }

      // Could use policy here to check if autherized to delete this user
      await user.destroy()
      return this.response.status(204).json({ message: "User deleted" })
    } catch (error) {
      logger.error(error)
      return this.response.status(422).json({ message: `Failed to delete user. Error: ${error}` })
    }
  }

  private async loadUser(): Promise<User | null> {
    return User.findByPk(this.params.userId, { include: ["roles"] })
  }
}

export default UsersController
