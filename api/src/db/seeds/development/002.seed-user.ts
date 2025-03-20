import { isNil } from "lodash"

import { User } from "@/models"
import { UserAttributes } from "@/models/user"

export async function seed(): Promise<void> {
  const usersAttributes: Partial<UserAttributes>[] = [
    {
      first_name: "Seed",
      last_name: "User",
      email: "example1@example.com",
      auth_subject: "auth|00000",
    },
    {
      first_name: "Seed",
      last_name: "User",
      email: "example2@example.com",
      auth_subject: "auth|00001",
    },
  ]

  for (const userAttributes of usersAttributes) {
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
}
