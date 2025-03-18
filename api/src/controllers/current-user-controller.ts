import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { Users } from "@/serializers"
import BaseController from "@/controllers/base-controller"

export class CurrentUserController extends BaseController {
  async show() {
    try {
      const user = this.currentUser
      const policy = this.buildPolicy(user)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view the current user",
        })
      }

      const serializedUser = Users.ShowSerializer.perform(user)
      return this.response.json({ user: serializedUser, policy })
    } catch (error) {
      return this.response.status(400).json({
        message: `Error fetching current user: ${error}`,
      })
    }
  }

  private buildPolicy(user: User) {
    return new UsersPolicy(this.currentUser, user)
  }
}

export default CurrentUserController
