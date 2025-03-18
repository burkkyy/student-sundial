import { pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserReferenceView = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
>

export class ReferenceSerializer extends BaseSerializer<User> {
  perform(): UserReferenceView {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "title",
        "department",
        "division",
        "branch",
        "unit",
      ]),
    }
  }
}

export default ReferenceSerializer
