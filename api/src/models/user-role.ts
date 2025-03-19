import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import User from "@/models/user"

export enum RoleTypes {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  PROFESSOR = "PROFESSOR",
  STUDENT = "STUDENT",
  USER = "USER",
}

export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(RoleTypes)],
      msg: `Role must be one of ${Object.values(RoleTypes).join(", ")}`,
    },
  })
  declare role: RoleTypes

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations
  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "roles",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>
}

export default UserRole
