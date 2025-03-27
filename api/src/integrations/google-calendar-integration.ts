import { isEmpty, isUndefined } from "lodash"
import { google } from "googleapis"

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

      const auth = new google.auth.OAuth2()
      auth.setCredentials({ access_token: googleAccessToken })

      const calendar = google.calendar("v3")
      const response = await calendar.events.insert({
        auth: auth,
        calendarId: "primary",
        requestBody: {
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
        },
      })

      //logger.info("Event created: ", response.data.htmlLink)
      return response.data
    } catch (error) {
      logger.error("Failed to create google calendar event: ", { error })
      throw new GoogleApiError(error)
    }
  },
}

export default googleCalendarIntegration
