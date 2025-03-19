import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { User } from "@/models"

export async function seed(): Promise<void> {
  const userAttributes: CreationAttributes<User> = {
    email: "example@example.com",
    authSubject: "auth|00000",
  }

  const user = await User.findOne({
    where: {
      email: userAttributes.email,
    },
  })

  if (isNil(user)) {
    await User.create(userAttributes)
  } else {
    await user.update(userAttributes)
  }
}
