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

import BaseModel from "@/models/base-model"

export class Retention extends BaseModel<
  InferAttributes<Retention>,
  InferCreationAttributes<Retention>
> {
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

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isDefault: boolean

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare expireSchedule: string

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare expireAction: string

  @Attribute(DataTypes.INTEGER)
  declare retentionDays: number | null

  @Attribute(DataTypes.DATE(0))
  declare retentionDate: Date | null

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
    this.addSearchScope(["name"])
  }
}

export default Retention
