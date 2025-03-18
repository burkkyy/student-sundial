import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Retention, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class RetentionPolicy extends PolicyFactory(Retention) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user?.isSystemAdmin) return true
    return false
  }

  update(): boolean {
    if (this.user?.isSystemAdmin) return true
    return false
  }

  destroy(): boolean {
    if (this.user?.isSystemAdmin) return true
    return false
  }

  permittedAttributes(): Path[] {
    const attributes: (keyof Attributes<Retention>)[] = [
      "name",
      "description",
      "isDefault",
      "expireSchedule",
      "expireAction",
      "retentionDays",
      "retentionDate",
    ]

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Retention>> {
    return {}
  }
}

export default RetentionPolicy
