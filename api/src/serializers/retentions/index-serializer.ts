import { pick } from "lodash"

import { Retention } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type RetentionIndexView = Pick<
  Retention,
  | "id"
  | "name"
  | "description"
  | "isDefault"
  | "expireSchedule"
  | "expireAction"
  | "retentionDays"
  | "retentionDate"
>

export class IndexSerializer extends BaseSerializer<Retention> {
  perform(): RetentionIndexView {
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
      ]),
    }
  }
}

export default IndexSerializer
