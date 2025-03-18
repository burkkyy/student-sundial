import { isNil, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserIndexView = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "categories"
  | "sources"
  | "userPermissions"
  | "deactivatedAt"
> & {
  isActive: boolean
}

export class IndexSerializer extends BaseSerializer<User> {
  perform(): UserIndexView {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "roles",
        "title",
        "department",
        "division",
        "branch",
        "unit",
        "categories",
        "sources",
        "userPermissions",
        "deactivatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
    }
  }
}

export default IndexSerializer
