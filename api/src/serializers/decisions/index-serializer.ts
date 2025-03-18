import { pick } from "lodash"

import { ArchiveItem } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { ReferenceSerializer } from "@/serializers/users"
import { UserReferenceView } from "@/serializers/users/reference-serializer"

export type DecisionIndexView = Pick<
  ArchiveItem,
  "title" | "description" | "summary" | "securityLevel" | "status" | "decisionText"
> & { user: UserReferenceView | null }

export class IndexSerializer extends BaseSerializer<ArchiveItem> {
  perform(): DecisionIndexView {
    return {
      ...pick(this.record, [
        "id",
        "title",
        "description",
        "summary",
        "securityLevel",
        "status",
        "calculatedExpireDate",
        "decisionText",
      ]),
      user: this.record.user ? ReferenceSerializer.perform(this.record.user) : null,
    }
  }
}

export default IndexSerializer
