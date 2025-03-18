import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

import { User } from "@/models"

export const userFactory = Factory.define<User>(({ sequence, params, onCreate }) => {
  onCreate((user) => user.save())

  const firstName = params.firstName || faker.person.firstName()
  const lastName = params.lastName || faker.person.lastName()
  const email = params.email || faker.internet.email({ firstName, lastName })

  return User.build({
    id: sequence,
    auth0Subject: params.auth0Subject || email,
    email,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    roles: [User.Roles.USER],
  })
})

export default userFactory
