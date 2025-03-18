import { Attributes, FindOptions, sql } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItem, ArchiveItemAudit, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"
import { isUndefined } from "lodash"

export class ArchiveItemAuditsPolicy extends PolicyFactory(ArchiveItemAudit) {
  show(): boolean {
    if (this.users.some((user) => user.id === this.user?.id)) {
      return true
    }
    if (this.user?.isSystemAdmin) return true

    return false
  }

  create(): boolean {
    return false
  }

  update(): boolean {
    return false
  }

  destroy(): boolean {
    return false
  }

  permittedAttributes(): Path[] {
    const attributes: (keyof Attributes<ArchiveItem>)[] = []
    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<ArchiveItemAudit>> {
    const idQuery = ArchiveItemAuditsPolicy.makePermissionQuery(user)
    return {
      where: sql`[ArchiveItemAudit].archive_item_id IN (${sql.literal(idQuery)})`,
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
    if (isUndefined(this.record.archiveItem?.users)) {
      throw new Error("Expected record to have a users association")
    }

    return this.record.archiveItem?.users
  }
}

export default ArchiveItemAuditsPolicy
