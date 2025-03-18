import http from "@/api/http-client"

export type Status = {
  RELEASE_TAG: string
  GIT_COMMIT_HASH: string
}

export const statusApi = {
  /**
   *  Note: This is a public API route, and not protected by authentication
   */
  async get(): Promise<Status> {
    const { data } = await http.get("/_status")
    return data
  },
}

export default statusApi
