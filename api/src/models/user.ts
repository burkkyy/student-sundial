import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  HasMany,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import UserRole, { RoleTypes } from "@/models/user-role"

export class User extends BaseModel<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare email: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare authSubject: string

  @Attribute(DataTypes.STRING(100))
  declare firstName: string | null

  @Attribute(DataTypes.STRING(100))
  declare lastName: string | null

  @Attribute(DataTypes.STRING(200))
  declare displayName: string | null

  @Attribute(DataTypes.STRING(100))
  declare title: string | null

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations
  @HasMany(() => UserRole, {
    foreignKey: "userId",
    inverse: {
      as: "User",
    },
  })
  declare roles?: NonAttribute<UserRole[]>

  get roleTypes(): NonAttribute<RoleTypes[]> {
    return this.roles?.map(({ role }) => role) || []
  }

  get isSystemAdmin(): NonAttribute<boolean> {
    return this.roleTypes.includes(RoleTypes.SYSTEM_ADMIN)
  }

  get isProfessor(): NonAttribute<boolean> {
    return this.roleTypes.includes(RoleTypes.PROFESSOR)
  }

  get isStudent(): NonAttribute<boolean> {
    return this.roleTypes.includes(RoleTypes.STUDENT)
  }

  static establishScopes(): void {
    this.addSearchScope(["firstName", "lastName", "displayName"])
  }
}

export default User
