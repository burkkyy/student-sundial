import { readFileSync } from "fs"

import logger from "@/utils/logger"
import { convertDateTime } from "@/utils/convert-time-formats"

import BaseController from "@/controllers/base-controller"
import { getTimetableFromPdf } from "@/lib/pdf-parser"
import { Course, Block } from "@/models"

export class TimetableUploadController extends BaseController {
  async create() {
    try {
      const formData = this.request.body.file

      if (formData.type !== "application/pdf") {
        throw new Error("file is not a pdf")
      }

      const pdf = readFileSync(formData.path)
      const timetable = await getTimetableFromPdf(pdf)

      for (const course of timetable.courses) {
        await Course.create({
          name: course.name,
          description: "",
        })

        for (const block of course.blocks) {
          const start_at = convertDateTime(block.startDate, block.startTime)
          const end_at = convertDateTime(block.endDate, block.endTime)

          await Block.create({
            start_at,
            end_at,
            location: block.location,
            recurrence: "",
            is_cancelled: false,
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
