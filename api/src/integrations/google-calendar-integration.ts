import { isEmpty, isUndefined } from "lodash"
import axios from "axios"

import logger from "@/utils/logger"
import { auth0Integration } from "@/integrations/auth0-integration"

export interface GoogleCalendarEvent {
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  recurrence?: string[]
}

export class GoogleApiError extends Error {
  constructor(data: unknown) {
    super(`Response from googleapis is strange or failed for: ${JSON.stringify(data)}`)
    this.name = "GoogleApiError"
  }
}

export const googleCalendarIntegration = {
  async createEvent(auth0Subject: string, event: GoogleCalendarEvent) {
    try {
      console.log(auth0Subject)
      const googleAccessToken = await auth0Integration.getGoogleAccessToken(auth0Subject)

      if (isUndefined(googleAccessToken) || isEmpty(googleAccessToken)) {
        throw new Error("No Google access token available for this user")
      }

      const calendarApiUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

      const response = await axios.post(
        calendarApiUrl,
        {
          summary: event.summary,
          description: event.description,
          location: event.location,
          colorId: "4",
          start: {
            dateTime: event.start.dateTime,
            timeZone: event.start.timeZone,
          },
          end: {
            dateTime: event.end.dateTime,
            timeZone: event.end.timeZone,
          },
          recurrence: event.recurrence,
        },
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      //logger.info("Event created: ", response.data.htmlLink)
      return response.data
    } catch (error) {
      logger.error("Failed to create google calendar event: ", { error })
      throw new GoogleApiError(error)
    }
  },
}

export default googleCalendarIntegration
