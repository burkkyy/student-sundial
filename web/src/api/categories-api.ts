import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { Retention } from "./retentions-api"

/** Keep in sync with api/src/models/categories.ts */

export type Category = {
  id: number
  name: string
  description: string | null
  retentionId: number
  createdAt: string
  updatedAt: string

  // Associations
  retention: Retention | null
}

export type CategoryWhereOptions = {
  name?: string
}

export type CategoryFiltersOptions = {
  search?: string | string[]
}

export const categoriesApi = {
  async list(
    params: {
      where?: CategoryWhereOptions
      filters?: CategoryFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    categories: Category[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/categories", {
      params,
    })
    return data
  },
  async get(categoryId: number): Promise<{
    category: Category
    policy: Policy
  }> {
    const { data } = await http.get(`/api/categories/${categoryId}`)
    return data
  },
  async create(attributes: Partial<Category>): Promise<{
    category: Category
  }> {
    const { data } = await http.post("/api/categories", attributes)
    return data
  },
  async update(
    categoryId: number,
    attributes: Partial<Category>
  ): Promise<{
    category: Category
  }> {
    const { data } = await http.patch(`/api/categories/${categoryId}`, attributes)
    return data
  },
  async delete(categoryId: number): Promise<void> {
    const { data } = await http.delete(`/api/categories/${categoryId}`)
    return data
  },
}

export default categoriesApi
