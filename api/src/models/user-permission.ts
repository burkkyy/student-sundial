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
import User from "@/models/user"

export class UserPermission extends BaseModel<
  InferAttributes<UserPermission>,
  InferCreationAttributes<UserPermission>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  declare userId: number | null

  @Attribute(DataTypes.STRING(100))
  declare userEmail: string | null

  @Attribute(DataTypes.INTEGER)
  declare categoryId: number | null

  @Attribute(DataTypes.INTEGER)
  declare sourceId: number | null

  @Attribute(DataTypes.INTEGER)
  declare archiveItemId: number | null

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare canViewAttachments: boolean

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
  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "userPermissions",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {}
}

export default UserPermission
