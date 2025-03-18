import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItem, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"
import { isNil, isUndefined } from "lodash"

export class IntegrationsPolicy extends PolicyFactory(ArchiveItem) {
  show(): boolean {
    return false
  }

  create(): boolean {
    if (isNil(this.source)) return false

    return true
  }

  update(): boolean {
    return false
  }

  destroy(): boolean {
    return false
  }

  permittedAttributes(): Path[] {
    const attributes: (keyof Attributes<ArchiveItem>)[] = [
      "title",
      "description",
      "decisionText",
      "isDecision",
      "summary",
      "securityLevel",
      "tags",
      "submittedAt",
    ]
    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<ArchiveItem>> {
    return {}
  }
  private get users(): User[] {
    if (isUndefined(this.record.users)) {
      throw new Error("Expected record to have a users association")
    }

    return this.record.users
  }
}

export default IntegrationsPolicy
