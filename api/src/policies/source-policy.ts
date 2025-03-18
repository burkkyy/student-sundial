import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Source, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class SourcePolicy extends PolicyFactory(Source) {
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
    const attributes: (keyof Attributes<Source>)[] = [
      "name",
      "description",
      "contactEmail",
      "referrers",
      "redirects",
    ]

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Source>> {
    return {}
  }
}

export default SourcePolicy
