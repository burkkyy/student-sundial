import { exec } from "child_process"
import { isEmpty } from "lodash"
import { writeFileSync, readFileSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

import logger from "@/utils/logger"

import { PDF_PARSER_JS } from "@/config"

if (isEmpty(PDF_PARSER_JS)) throw new Error("pdf parser js filepath is unset.")

const getTempFilePath = (prefix: string) => join(tmpdir(), `${prefix}-${Date.now()}.pdf`)

export async function getTimetableFromPdf(inputPDF: Buffer) {
  const tempInputPath = getTempFilePath("input")
  const tempOutputPath = getTempFilePath("output")

  try {
    writeFileSync(tempInputPath, inputPDF)

    const cmd: string = `node ${PDF_PARSER_JS} ${tempInputPath} ${tempOutputPath}`

    await new Promise<void>((resolve, reject) => {
      exec(cmd, { encoding: "buffer" }, (error, _stdout, stderr) => {
        if (error) {
          logger.error("pdf-parser error:", stderr.toString())
          reject(new Error(`pdf-parser error: ${stderr.toString()}`))
          return
        }
        resolve()
      })
    })

    const dataBuffer = readFileSync(tempOutputPath, "utf-8")
    return JSON.parse(dataBuffer)
  } finally {
    try {
      unlinkSync(tempInputPath)
      unlinkSync(tempOutputPath)
    } catch (cleanupError) {
      logger.warn("Failed to clean up temporary files:", cleanupError)
    }
  }
}
