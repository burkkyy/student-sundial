import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Category, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class CategoryPolicy extends PolicyFactory(Category) {
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
    const attributes: (keyof Attributes<Category>)[] = ["name", "description", "retentionId"]

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Category>> {
    return {}
  }
}

export default CategoryPolicy
