import http from "@/api/http-client"

// eslint-disable-next-line @typescript-eslint/ban-types
export type GoogleCalendarQueryOptions = {}

export const googleCalendarApi = {
  async listEvents(params: GoogleCalendarQueryOptions = {}): Promise<{
    events: string[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/google-calendar", {
      params,
    })
    return data
  },
}

export default googleCalendarApi
