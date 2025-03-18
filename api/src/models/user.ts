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
  Default,
  HasMany,
  Index,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { isNil } from "lodash"

import BaseModel from "@/models/base-model"
import UserPermission from "./user-permission"

/** Keep in sync with web/src/api/users-api.ts */
export enum UserRoles {
  SYSTEM_ADMIN = "system_admin",
  USER = "user",
}

export class User extends BaseModel<InferAttributes<User>, InferCreationAttributes<User>> {
  static readonly Roles = UserRoles

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare email: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare auth0Subject: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare firstName: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare lastName: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare displayName: string

  @Attribute({
    type: DataTypes.STRING(255),
    get() {
      const roles = this.getDataValue("roles")
      if (isNil(roles)) {
        return []
      }
      return roles.split(",")
    },
    set(value: string[]) {
      this.setDataValue("roles", value.join(","))
    },
  })
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(UserRoles)],
      msg: `Role must be one of ${Object.values(UserRoles).join(", ")}`,
    },
  })
  declare roles: string[]

  @Attribute(DataTypes.STRING(100))
  declare title: string | null

  @Attribute(DataTypes.STRING(100))
  declare department: string | null

  @Attribute(DataTypes.STRING(100))
  declare division: string | null

  @Attribute(DataTypes.STRING(100))
  declare branch: string | null

  @Attribute(DataTypes.STRING(100))
  declare unit: string | null

  @Attribute(DataTypes.DATE(0))
  declare deactivatedAt: Date | null

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

  // Magic Attributes
  get isSystemAdmin(): NonAttribute<boolean | undefined> {
    return this.roles?.some((role) => role === UserRoles.SYSTEM_ADMIN)
  }

  get categories(): NonAttribute<number[]> {
    if (this.userPermissions) {
      return this.userPermissions
        ?.map((permission) => permission.categoryId)
        .filter((categoryId) => !isNil(categoryId))
    }
    return []
  }

  get sources(): NonAttribute<number[]> {
    if (this.userPermissions) {
      return this.userPermissions
        ?.map((permission) => permission.sourceId)
        .filter((sourceId) => !isNil(sourceId))
    }
    return []
  }

  // Associations
  @HasMany(() => UserPermission, {
    foreignKey: "userId",
    inverse: {
      as: "user",
    },
  })
  declare userPermissions?: NonAttribute<UserPermission[]>

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["firstName", "lastName", "displayName"])
  }
}

export default User
