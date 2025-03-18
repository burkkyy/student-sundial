import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItem, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"
import { isUndefined } from "lodash"

export class DecisionPolicy extends PolicyFactory(ArchiveItem) {
  show(): boolean {
    if (this.users.some((user) => user.id === this.user?.id)) {
      return true
    }

    return false
  }

  create(): boolean {
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
      "retentionName",
      "calculatedExpireDate",
      "overrideExpireDate",
      "expireAction",
      "sourceId",
      "userId",
      "title",
      "description",
      "decisionText",
      "isDecision",
      "summary",
      "status",
      "securityLevel",
      "tags",
      "submittedAt",
    ]

    /* if (this.user.isSystemAdmin) {
      attributes.push("email", "roles", "deactivatedAt")
    } */

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

export default DecisionPolicy
