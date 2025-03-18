import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { GenericFormData } from "axios"
import { Category } from "./categories-api"
import { User } from "./users-api"
import { Source } from "./sources-api"

export enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum ArchiveItemStatus {
  ACCEPTED = "Accepted",
  REVIEWED = "Reviewed",
  LOCKED = "Locked",
  HIDDEN = "Hidden",
}

export type ArchiveItem = {
  id: number
  title: string
  retentionName: string
  calculatedExpireDate: Date
  overrideExpireDate: Date | null
  expireAction: string
  sourceId: number | null
  userId: number | null
  description: string | null
  summary: string | null
  status: ArchiveItemStatus
  securityLevel: SecurityLevel
  tags: string[]
  submittedAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null

  categories: Category[] | null
  files: ArchiveItemFile[] | null
  user: User | null
  source: Source | null
  users: User[] | null
  permittedUsers: User[] | null
}

export type ArchiveItemFile = {
  id: number
  archiveItemId: number | null
  bucket: string | null
  originalKey: string | null
  originalFileName: string | null
  originalMimeType: string
  originalFileSize: number
  pdfKey: string | null
  pdfFileName: string | null
  pdfMimeType: string | null
  pdfFileSize: number | null
  comment: string | null
  createdAt: Date | null
  updatedAt: Date | null
}
export type ArchiveItemCreate = {
  title: string
  retentionName: string | null
  expireAction: string | null
  calculatedExpireDate: Date | string | null
  overrideExpireDate: Date | string | null
  description: string | null
  summary: string | null
  securityLevel: SecurityLevel
  tags: string[] | null

  files: File[] | null
  categories: number[] | null
}

export type ArchiveItemWhereOptions = {
  name?: string
}

export type ArchiveItemFiltersOptions = {
  search?: string | string[]
}

export const archiveItemsApi = {
  async list(
    params: {
      where?: ArchiveItemWhereOptions
      filters?: ArchiveItemFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    archiveItems: ArchiveItem[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/archive-items", {
      params,
    })
    return data
  },
  async get(archiveItemId: number): Promise<{
    archiveItem: ArchiveItem
    policy: Policy
  }> {
    const { data } = await http.get(`/api/archive-items/${archiveItemId}`)
    return data
  },
  async create(attributes: FormData | GenericFormData | ArchiveItemCreate): Promise<{
    archiveItem: ArchiveItem
  }> {
    const { data } = await http.post("/api/archive-items", attributes, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  async update(
    archiveItemId: number,
    attributes: Partial<ArchiveItem>
  ): Promise<{
    archiveItem: ArchiveItem
  }> {
    const { data } = await http.patch(`/api/archive-items/${archiveItemId}`, attributes)
    return data
  },
  async delete(archiveItemId: number): Promise<void> {
    const { data } = await http.delete(`/api/archive-items/${archiveItemId}`)
    return data
  },

  async download(archiveItemId: number, fileId: number, getProtected: boolean) {
    const { data } = await http.get(
      `/api/archive-items/${archiveItemId}/files/${fileId}${getProtected ? "?format=protected" : ""}`,
      {
        responseType: "blob",
      }
    )
    return data
  },
}

export default archiveItemsApi
