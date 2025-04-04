import { readFileSync } from "fs"

import logger from "@/utils/logger"
import { convertDateTime } from "@/utils/convert-time-formats"

import BaseController from "@/controllers/base-controller"
import { getTimetableFromPdf } from "@/lib/pdf-parser"
import { Course, Block, CourseBlock } from "@/models"

export class TimetableUploadController extends BaseController {
  async create() {
    try {
      const formData = this.request.body.file

      if (formData.type !== "application/pdf") {
        throw new Error("file is not a pdf")
      }

      const pdf = readFileSync(formData.path)
      const timetable = await getTimetableFromPdf(pdf)

      let currentCourse = undefined

      for (const course of timetable.courses) {
        currentCourse = await Course.create({
          name: course.name,
          description: "",
        })

        for (const block of course.blocks) {
          const start_at = convertDateTime(block.startDate, block.startTime)
          const end_at = convertDateTime(block.endDate, block.endTime)

          const newBlock = await Block.create({
            start_at,
            end_at,
            days: block.days,
            location: block.location,
            recurrence: "",
            is_cancelled: false,
          })

          currentCourse.start_on = start_at
          currentCourse.end_on = end_at
          currentCourse.sync()

          await CourseBlock.create({
            course_id: currentCourse.id,
            block_id: newBlock.id,
          })
        }
      }

      return this.response.sendStatus(200)
    } catch (error) {
      logger.error(error)
      return this.response.status(400).json({
        message: `Error while creating timetable from uploaded file: ${error}`,
      })
    }
  }
}

export default TimetableUploadController
