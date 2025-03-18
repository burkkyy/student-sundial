import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"

/** Keep in sync with api/src/models/user.ts */
export enum UserRoles {
  SYSTEM_ADMIN = "system_admin",
  USER = "user",
}

export type User = {
  id: number
  email: string
  auth0Subject: string
  firstName: string
  lastName: string
  displayName: string
  roles: UserRoles[]
  title: string | null
  department: string | null
  division: string | null
  branch: string | null
  unit: string | null
  deactivatedAt: string | null
  createdAt: string
  updatedAt: string

  // Virtuals
  isActive: boolean
  categories?: number[]
  sources?: number[]

  // Associations
}

export type UserWhereOptions = {
  email?: string
  title?: string
  department?: string
  division?: string
  branch?: string
  unit?: string
}

export type UserFiltersOptions = {
  search?: string | string[]
  // TODO: implement isActive scope in back-end
}

export const usersApi = {
  UserRoles,
  async list(
    params: {
      where?: UserWhereOptions
      filters?: UserFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    users: User[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/users", {
      params,
    })
    return data
  },
  async get(userId: number): Promise<{
    user: User
    policy: Policy
  }> {
    const { data } = await http.get(`/api/users/${userId}`)
    return data
  },
  async create(attributes: Partial<User>): Promise<{
    user: User
  }> {
    const { data } = await http.post("/api/users", attributes)
    return data
  },
  async update(
    userId: number,
    attributes: Partial<User>
  ): Promise<{
    user: User
  }> {
    const { data } = await http.patch(`/api/users/${userId}`, attributes)
    return data
  },
  async delete(userId: number): Promise<void> {
    const { data } = await http.delete(`/api/users/${userId}`)
    return data
  },
}

export default usersApi
