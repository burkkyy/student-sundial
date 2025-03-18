import { pick } from "lodash"

import { ArchiveItemAudit } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import ReferenceSerializer, { UserReferenceView } from "@/serializers/users/reference-serializer"

export type ArchiveItemAuditIndexView = Pick<
  ArchiveItemAudit,
  "id" | "archiveItemId" | "archiveItemFile" | "action" | "description" | "createdAt"
> & { user: UserReferenceView | null }

export class IndexSerializer extends BaseSerializer<ArchiveItemAudit> {
  perform(): ArchiveItemAuditIndexView {
    return {
      ...pick(this.record, [
        "id",
        "archiveItemId",
        "archiveItemFileId",
        "action",
        "description",
        "createdAt",
      ]),
      user: this.record.user ? ReferenceSerializer.perform(this.record.user) : null,
    }
  }
}

export default IndexSerializer
