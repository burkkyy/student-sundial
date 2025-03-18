import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"

/** Keep in sync with api/src/models/retention.ts */

export type Retention = {
  id: number
  name: string
  description: string | null
  isDefault: boolean
  expireSchedule: string
  expireAction: string
  retentionDays: number | null
  retentionDate: Date | null
  createdAt: string
  updatedAt: string

  // Associations
  // add as needed
}

export type RetentionWhereOptions = {
  name?: string
}

export type RetentionFiltersOptions = {
  search?: string | string[]
}

export const retentionsApi = {
  async list(
    params: {
      where?: RetentionWhereOptions
      filters?: RetentionFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    retentions: Retention[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/retentions", {
      params,
    })
    return data
  },
  async get(retentionId: number): Promise<{
    retention: Retention
    policy: Policy
  }> {
    const { data } = await http.get(`/api/retentions/${retentionId}`)
    return data
  },
  async create(attributes: Partial<Retention>): Promise<{
    retention: Retention
  }> {
    const { data } = await http.post("/api/retentions", attributes)
    return data
  },
  async update(
    retentionId: number,
    attributes: Partial<Retention>
  ): Promise<{
    retention: Retention
  }> {
    const { data } = await http.patch(`/api/retentions/${retentionId}`, attributes)
    return data
  },
  async delete(retentionId: number): Promise<void> {
    const { data } = await http.delete(`/api/retentions/${retentionId}`)
    return data
  },
}

export default retentionsApi
