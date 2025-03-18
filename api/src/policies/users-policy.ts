import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class UsersPolicy extends PolicyFactory(User) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user?.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user?.isSystemAdmin) return true
    if (this.user?.id === this.record.id) return true

    return false
  }

  destroy(): boolean {
    if (this.user?.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    const attributes: (keyof Attributes<User>)[] = [
      "firstName",
      "lastName",
      "displayName",
      "title",
      "department",
      "division",
      "branch",
      "unit",
    ]

    if (this.user?.isSystemAdmin) {
      attributes.push("email", "roles", "deactivatedAt")
    }

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<User>> {
    return {}
  }
}

export default UsersPolicy
