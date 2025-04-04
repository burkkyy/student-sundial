import { isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import {
  magicGetDateFromDay,
  magicDatetimeMaker,
  magigMakeEventEndString,
  makeR8DateString,
} from "@/utils/convert-time-formats"

import {
  googleCalendarIntegration,
  GoogleCalendarEvent,
} from "@/integrations/google-calendar-integration"
import { Course } from "@/models"

import BaseController from "@/controllers/base-controller"

export class GoogleCalendarController extends BaseController {
  async index() {
    try {
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
    try {
      const courses = await Course.findAll()

      let recurrenceEndDate: string | undefined

      for (const course of courses) {
        await course.fetchBlocks()

        if (isNil(course.blocks)) {
          continue
        }

        for (const block of course.blocks) {
          const courseEndDatetime = magicDatetimeMaker(block.end_at, block.end_at)

          if (isUndefined(recurrenceEndDate)) {
            recurrenceEndDate = courseEndDatetime
          }

          const days = block.days.split(" ")

          for (const day of days) {
            const eventStartDate = magicGetDateFromDay(block.start_at, day)
            const eventStartDatetime = makeR8DateString(eventStartDate)

            const eventEndDatetime = magigMakeEventEndString(
              eventStartDate.toISOString(),
              block.end_at
            )

            const calendarEvent: GoogleCalendarEvent = {
              summary: course.name,
              description: block.location,
              start: {
                dateTime: eventStartDatetime,
                timeZone: "America/Vancouver",
              },
              end: {
                dateTime: eventEndDatetime,
                timeZone: "America/Vancouver",
              },
              recurrence: [`RRULE:FREQ=WEEKLY;UNTIL=${recurrenceEndDate}`],
            }
            console.log("CREATNG EVENT: ", calendarEvent)
            await googleCalendarIntegration.createEvent(
              this.currentUser.auth_subject,
              calendarEvent
            )
          }
        }
      }
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
}

export default GoogleCalendarController
