import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { User } from "@/api/users-api"

export const currentUserApi = {
  async get(): Promise<{
    user: User
    policy: Policy
  }> {
    const { data } = await http.get(`/api/current-user`)
    return data
  },
}

export default currentUserApi
