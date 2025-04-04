import { NextFunction, Request, Response } from "express"

import { User } from "@/models"

export type Actions = "index" | "show" | "new" | "edit" | "create" | "update" | "destroy"

type ControllerRequest = Request & {
  currentUser: User
}

// See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
export class BaseController {
  protected request: ControllerRequest
  protected response: Response
  protected next: NextFunction

  constructor(req: Request, res: Response, next: NextFunction) {
    // Assumes authorization has occured first in
    // api/src/middlewares/jwt-middleware.ts and api/src/middlewares/authorization-middleware.ts
    // At some future point it would make sense to do all that logic as
    // controller actions to avoid the need for hack
    this.request = req as ControllerRequest
    this.response = res
    this.next = next
  }

  static get index() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.index().catch(next)
    }
  }

  static get create() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.create().catch(next)
    }
  }

  static get show() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.show().catch(next)
    }
  }

  static get update() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.update().catch(next)
    }
  }

  static get destroy() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.destroy().catch(next)
    }
  }

  index(): Promise<unknown> {
    throw new Error("Not Implemented")
  }

  create(): Promise<unknown> {
    throw new Error("Not Implemented")
  }

  show(): Promise<unknown> {
    throw new Error("Not Implemented")
  }

  update(): Promise<unknown> {
    throw new Error("Not Implemented")
  }

  destroy(): Promise<unknown> {
    throw new Error("Not Implemented")
  }

  get currentUser(): User {
    return this.request.currentUser
  }

  get params() {
    return this.request.params
  }

  get query() {
    return this.request.query
  }
}

export default BaseController
