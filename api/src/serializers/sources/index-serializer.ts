import { pick } from "lodash"

import { Source } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type SourceIndexView = Pick<
  Source,
  "id" | "name" | "description" | "contactEmail" | "referrers" | "redirects"
>

export class IndexSerializer extends BaseSerializer<Source> {
  perform(): SourceIndexView {
    return {
      ...pick(this.record, ["id", "name", "description", "contactEmail", "referrers", "redirects"]),
    }
  }
}

export default IndexSerializer
