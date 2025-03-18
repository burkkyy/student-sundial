import { Attributes, FindOptions, sql } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItem, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"
import { isUndefined } from "lodash"

export class ArchiveItemsPolicy extends PolicyFactory(ArchiveItem) {
  show(): boolean {
    if (this.users.some((user) => user.id === this.user?.id)) {
      return true
    }

    return false
  }

  create(): boolean {
    //if (this.user.isSystemAdmin) return true

    return true
  }

  update(): boolean {
    //if (this.user.isSystemAdmin) return true
    //if (this.user.id === this.record.id) return true

    return false
  }

  destroy(): boolean {
    //if (this.user.isSystemAdmin) return true

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

  static policyScope(user: User): FindOptions<Attributes<ArchiveItem>> {
    const idQuery = ArchiveItemsPolicy.makePermissionQuery(user)
    return {
      where: sql`[ArchiveItem].id IN (${sql.literal(idQuery)})`,
    }
  }

  static makePermissionQuery(user: User): string {
    const categoryIds =
      user.userPermissions?.map((p) => p.categoryId).filter((id) => id !== null) ?? []
    const sourceIds = user.userPermissions?.map((p) => p.sourceId).filter((id) => id !== null) ?? []
    const archiveItemIds =
      user.userPermissions?.map((p) => p.archiveItemId).filter((id) => id !== null) ?? []

    let idQuery = `SELECT archive_items.id FROM archive_items INNER JOIN archive_item_categories ON (archive_items.id = archive_item_categories.archive_item_id AND archive_item_categories.deleted_at IS NULL) WHERE 0=1`

    if (sourceIds.length > 0) idQuery += ` OR archive_items.source_id IN (${sourceIds.join(",")})`
    if (archiveItemIds.length > 0)
      idQuery += ` OR archive_items.id IN (${archiveItemIds.join(",")})`
    if (categoryIds.length > 0)
      idQuery += ` OR archive_item_categories.category_id IN (${categoryIds.join(",")})`

    return idQuery
  }
  private get users(): User[] {
    if (isUndefined(this.record.users)) {
      throw new Error("Expected record to have a users association")
    }

    return this.record.users
  }
}

export default ArchiveItemsPolicy
