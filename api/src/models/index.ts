import db from "@/db/db-client"

// Models
import User from "@/models/user"
import UserPermission from "@/models/user-permission"
import Source from "@/models/source"
import Retention from "@/models/retention"
import Category from "@/models/category"
import ArchiveItem from "@/models/archive-item"
import ArchiveItemAudit from "./archive-item-audit"
import ArchiveItemCategory from "@/models/archive-item-category"
import ArchiveItemFile from "@/models/archive-item-file"
import SourceCategory from "@/models/source-category"

db.addModels([
  User,
  UserPermission,
  ArchiveItem,
  Source,
  Retention,
  Category,
  ArchiveItemAudit,
  ArchiveItemCategory,
  ArchiveItemFile,
  SourceCategory,
])

// Lazy load scopes
User.establishScopes()
UserPermission.establishScopes()
ArchiveItem.establishScopes()
Source.establishScopes()
Retention.establishScopes()
Category.establishScopes()
ArchiveItemCategory.establishScopes()
ArchiveItemAudit.establishScopes()
ArchiveItemFile.establishScopes()
SourceCategory.establishScopes()

export {
  User,
  UserPermission,
  Source,
  ArchiveItem,
  Retention,
  Category,
  ArchiveItemCategory,
  ArchiveItemAudit,
  ArchiveItemFile,
  SourceCategory,
}

// Special db instance will all models loaded
export default db
