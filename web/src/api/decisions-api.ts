import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { GenericFormData } from "axios"
import { Category } from "./categories-api"
import { User } from "./users-api"

export enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum DecisionStatus {
  ACCEPTED = "Accepted",
  REVIEWED = "Reviewed",
  LOCKED = "Locked",
  HIDDEN = "Hidden",
}

export type Decision = {
  id: number
  title: string
  isDecision: boolean
  decisionText: string
  retentionName: string
  calculatedExpireDate: Date
  overrideExpireDate: Date | null
  expireAction: string
  sourceId: number | null
  userId: number | null
  description: string | null
  summary: string | null
  status: DecisionStatus
  securityLevel: SecurityLevel
  tags: string[]
  submittedAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null

  categories: Category[] | null
  files: DecisionFile[] | null
  user: User | null
}

export type DecisionFile = {
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
export type DecisionCreate = {
  title: string
  decisionText: string
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

export type DecisionWhereOptions = {
  name?: string
}

export type DecisionFiltersOptions = {
  search?: string | string[]
}

export const decisionsApi = {
  async list(
    params: {
      where?: DecisionWhereOptions
      filters?: DecisionFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    decisions: Decision[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/decisions", {
      params,
    })
    return data
  },
  async get(decisionId: number): Promise<{
    decision: Decision
    policy: Policy
  }> {
    const { data } = await http.get(`/api/decisions/${decisionId}`)
    return data
  },
  async create(attributes: FormData | GenericFormData | DecisionCreate): Promise<{
    decision: Decision
  }> {
    const { data } = await http.post("/api/decisions", attributes, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  async update(
    decisionId: number,
    attributes: Partial<Decision>
  ): Promise<{
    decision: Decision
  }> {
    const { data } = await http.patch(`/api/decisions/${decisionId}`, attributes)
    return data
  },
  async delete(decisionId: number): Promise<void> {
    const { data } = await http.delete(`/api/decisions/${decisionId}`)
    return data
  },
}

export default decisionsApi
