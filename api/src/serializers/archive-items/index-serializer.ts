import { pick } from "lodash"

import { ArchiveItem } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import ReferenceSerializer, { UserReferenceView } from "@/serializers/users/reference-serializer"

export type ArchiveItemIndexView = Pick<
  ArchiveItem,
  "title" | "description" | "summary" | "securityLevel" | "status"
> & { user: UserReferenceView | null; archiveItemFileCount?: number }

export class IndexSerializer extends BaseSerializer<ArchiveItem> {
  perform(): ArchiveItemIndexView {
    return {
      ...pick(this.record, [
        "id",
        "title",
        "description",
        "summary",
        "securityLevel",
        "status",
        "calculatedExpireDate",
      ]),
      user: this.record.user ? ReferenceSerializer.perform(this.record.user) : null,
      archiveItemFileCount: this.record.dataValues.archiveItemFileCount,
    }
  }
}

export default IndexSerializer
