import BaseController from "@/controllers/base-controller"

import {
  googleCalendarIntegration,
  GoogleCalendarEvent,
} from "@/integrations/google-calendar-integration"
import logger from "@/utils/logger"

export class GoogleCalendarController extends BaseController {
  async index() {
    try {
      const event: GoogleCalendarEvent = {
        summary: "Student Sundial Test Event",
        start: {
          dateTime: "2025-03-27T10:00:00-07:00",
        },
        end: {
          dateTime: "2025-03-27T11:00:00-07:00",
        },
      }

      await googleCalendarIntegration.createEvent(this.currentUser.auth_subject, event)

      return this.response.json({
        eventStatus: "success",
      })
    } catch (error) {
      logger.error(`Error fetching calendar events: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching calendar events: ${error}`,
      })
    }
  }

  async show() {
    throw new Error("Not implemented")
  }

  async create() {
    throw new Error("Not implemented")
  }

  async update() {
    throw new Error("Not implemented")
  }

  async destroy() {
    throw new Error("Not implemented")
  }
}

export default GoogleCalendarController
