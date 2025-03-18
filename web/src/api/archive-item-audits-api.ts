import http from "@/api/http-client"
import { User } from "./users-api"
import { ArchiveItem, ArchiveItemFile } from "./archive-items-api"

export type ArchiveItemAudit = {
  id: number
  userId?: number
  archiveItemId: number
  archiveItemFileId: number
  action: string
  description: string | null
  createdAt: Date | null
  updatedAt: Date | null

  archiveItem?: ArchiveItem | null
  file?: ArchiveItemFile | null
  user?: User | null
}

export type ArchiveItemAuditWhereOptions = {
  name?: string
}

export type ArchiveItemAuditFiltersOptions = {
  search?: string | string[]
}

export const archiveItemAuditsApi = {
  async list(
    archiveItemId: number,
    params: {
      where?: ArchiveItemAuditWhereOptions
      filters?: ArchiveItemAuditFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    archiveItemAudits: ArchiveItemAudit[]
    totalCount: number
  }> {
    const { data } = await http.get(`/api/archive-items/${archiveItemId}/audits`, {
      params,
    })
    return data
  },
}

export default archiveItemAuditsApi
