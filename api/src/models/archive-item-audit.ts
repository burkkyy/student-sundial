import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  type NonAttribute,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import ArchiveItem from "./archive-item"
import ArchiveItemFile from "./archive-item-file"
import User from "./user"

export class ArchiveItemAudit extends BaseModel<
  InferAttributes<ArchiveItemAudit>,
  InferCreationAttributes<ArchiveItemAudit>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  declare userId?: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare archiveItemId: number

  @Attribute(DataTypes.INTEGER)
  declare archiveItemFileId?: number

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare action: string

  @Attribute(DataTypes.STRING(2000))
  declare description?: string

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => ArchiveItem, {
    foreignKey: "archiveItemId",
    inverse: {
      as: "archiveItemAudits",
      type: "hasMany",
    },
  })
  declare archiveItem?: NonAttribute<ArchiveItem>

  @BelongsTo(() => ArchiveItemFile, {
    foreignKey: "archiveItemFileId",
    inverse: {
      as: "archiveItemFileAudits",
      type: "hasMany",
    },
  })
  declare archiveItemFile?: NonAttribute<ArchiveItemFile>

  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "archiveItemAudits",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["action"])
  }
}

export default ArchiveItemAudit
