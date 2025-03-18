import { pick } from "lodash"

import { Source } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type SourceShowView = Pick<
  Source,
  | "id"
  | "name"
  | "description"
  | "contactEmail"
  | "referrers"
  | "redirects"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<Source> {
  perform(): SourceShowView {
    return {
      ...pick(this.record, [
        "id",
        "name",
        "description",
        "contactEmail",
        "referrers",
        "redirects",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer
