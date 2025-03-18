import { isNil, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserShowView = Pick<
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
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
}

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserShowView {
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
        "createdAt",
        "updatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
    }
  }
}

export default ShowSerializer
