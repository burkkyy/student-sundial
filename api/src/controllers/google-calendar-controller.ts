import BaseController from "@/controllers/base-controller"

import {
  googleCalendarIntegration,
  GoogleCalendarEvent,
} from "@/integrations/google-calendar-integration"
import logger from "@/utils/logger"

import { Course } from "@/models"
import { isNil } from "lodash"

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

  async create() {
    console.log("UPLOAD TIMETABLE TO GOOGLE CALENDAR")

    const courses = await Course.findAll()

    for (const course of courses) {
      await course.fetchBlocks()

      console.log("COURSE BLOCKS: ", course.blocks)
      if (isNil(course.blocks)) {
        continue
      }

      for (const block of course.blocks) {
        console.log("CREATNG EVENT")

        console.log(block)

        // const event: GoogleCalendarEvent = {
        //   summary: "Student Sundial Test Event",
        //   start: {
        //     dateTime: block.start_at,
        //   },
        //   end: {
        //     dateTime: block.end_at,
        //   },
        // }

        // await googleCalendarIntegration.createEvent(this.currentUser.auth_subject, event)
      }
    }
  }
}

export default GoogleCalendarController
