import BaseController from "./base-controller"

export class CurrentUserController extends BaseController {
  async show() {
    return this.response.status(200).json({ user: this.currentUser })
  }
}

export default CurrentUserController
