import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"

/** Keep in sync with api/src/models/source.ts */

export type Source = {
  id: number
  name: string
  description: string | null
  contactEmail: string | null
  referrers: string[] | null
  redirects: string[] | null
  createdAt: string
  updatedAt: string

  // Associations
  // add as needed
}

export type SourceWhereOptions = {
  name?: string
}

export type SourceFiltersOptions = {
  search?: string | string[]
}

export const sourcesApi = {
  async list(
    params: {
      where?: SourceWhereOptions
      filters?: SourceFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    sources: Source[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/sources", {
      params,
    })
    return data
  },
  async get(sourceId: number): Promise<{
    source: Source
    policy: Policy
  }> {
    const { data } = await http.get(`/api/sources/${sourceId}`)
    return data
  },
  async create(attributes: Partial<Source>): Promise<{
    source: Source
  }> {
    const { data } = await http.post("/api/sources", attributes)
    return data
  },
  async update(
    sourceId: number,
    attributes: Partial<Source>
  ): Promise<{
    source: Source
  }> {
    const { data } = await http.patch(`/api/sources/${sourceId}`, attributes)
    return data
  },
  async delete(sourceId: number): Promise<void> {
    const { data } = await http.delete(`/api/sources/${sourceId}`)
    return data
  },
}

export default sourcesApi
