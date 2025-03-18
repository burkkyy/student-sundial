import { auth0Integration } from "@/integrations"
import { User } from "@/models"
import BaseService from "@/services/base-service"
import CreateService from "@/services/users/create-service"

export class EnsureFromAuth0TokenService extends BaseService {
  constructor(private token: string) {
    super()
  }

  async perform(): Promise<User> {
    const { auth0Subject, email, firstName, lastName } = await auth0Integration.getUserInfo(
      this.token
    )

    const existingUser = await User.findOne({
      where: { auth0Subject },
      include: ["userPermissions"],
    })

    if (existingUser) {
      return existingUser
    }

    const firstTimeUser = await User.findOne({
      where: { auth0Subject: email },
      include: ["userPermissions"],
    })
    if (firstTimeUser) {
      await firstTimeUser.update({ auth0Subject })
      return firstTimeUser
    }

    await CreateService.perform({
      auth0Subject,
      email,
      firstName,
      lastName,
    })
    const newUser = await User.findOne({
      where: { auth0Subject },
      rejectOnEmpty: true,
      include: ["userPermissions"],
    })
    return newUser
  }
}

export default EnsureFromAuth0TokenService
