import { pick } from "lodash"

import { Retention } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type RetentionShowView = Pick<
  Retention,
  | "id"
  | "name"
  | "description"
  | "isDefault"
  | "expireSchedule"
  | "expireAction"
  | "retentionDays"
  | "retentionDate"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<Retention> {
  perform(): RetentionShowView {
    return {
      ...pick(this.record, [
        "id",
        "name",
        "description",
        "isDefault",
        "expireSchedule",
        "expireAction",
        "retentionDays",
        "retentionDate",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer
