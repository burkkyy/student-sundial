import http from "@/api/http-client"

// Must match User in api/src/models/user.ts
export type User = {
  id: number
  auth0Subject: string
  email: string
  firstName: string | null
  lastName: string | null
  displayName: string | null
  title: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string

  // associations
  roles: Role[] | null
}

// Must match roles in api/src/models/roles.ts
export enum RoleTypes {
  SYSTEM_ADMIN = "System Admin",
  USER = "User",
}
export const RoleTypesArray = [RoleTypes.SYSTEM_ADMIN, RoleTypes.USER]

export type Role = {
  id: number
  userId: User["id"]
  role: RoleTypes
  createdAt: Date
  updatedAt: Date
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserWhereOptions = {}

export type UserQueryOptions = {
  where?: UserWhereOptions
  page?: number
  perPage?: number
}

export const usersApi = {
  RoleTypes,
  async fetchCurrentUser(): Promise<{ user: User }> {
    const { data } = await http.get("/api/current-user")
    return data
  },
  async list(params: UserQueryOptions = {}): Promise<{
    users: User[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/users", {
      params,
    })
    return data
  },
  async get(userId: number): Promise<{ user: User }> {
    const { data } = await http.get(`/api/users/${userId}`)
    return data
  },
  async create(attributes: Partial<User>): Promise<{ user: User }> {
    const { data } = await http.post("/api/users", attributes)
    return data
  },
  async update(userId: number, attributes: Partial<User>): Promise<{ user: User }> {
    const { data } = await http.patch(`/api/users/${userId}`, attributes)
    return data
  },
  async delete(userId: number): Promise<void> {
    const { data } = await http.delete(`/api/users/${userId}`)
    return data
  },
}

export default usersApi
