import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  Index,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"
import { isEmpty, isNil } from "lodash"

import BaseModel from "@/models/base-model"

export class Source extends BaseModel<InferAttributes<Source>, InferCreationAttributes<Source>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Index({ unique: true })
  declare name: string

  @Attribute(DataTypes.STRING(2000))
  declare description: string | null

  @Attribute(DataTypes.STRING(255))
  declare contactEmail: string | null

  @Attribute({
    type: DataTypes.STRING(2000),
    get() {
      const referrers = this.getDataValue("referrers")
      if (isNil(referrers) || isEmpty(referrers)) {
        return []
      }
      return referrers.split(",")
    },
    set(value: string[]) {
      this.setDataValue("referrers", value.filter((v) => !isEmpty(v.trim())).join(","))
    },
  })
  declare referrers: string[] | null

  @Attribute({
    type: DataTypes.STRING(2000),
    get() {
      const redirects = this.getDataValue("redirects")
      if (isNil(redirects) || isEmpty(redirects)) {
        return []
      }
      return redirects.split(",")
    },
    set(value: string[]) {
      this.setDataValue("redirects", value.filter((v) => !isEmpty(v.trim())).join(","))
    },
  })
  declare redirects: string[] | null

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
  // Add as needed

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["name", "contactEmail"])
  }
}

export default Source
