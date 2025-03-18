import logger from "@/utils/logger"

import cacheClient from "@/db/cache-client"
import { Request, Response } from "express"

export class ConversionController {
  async index(_req: Request, res: Response) {
    try {
      const toConvert = await cacheClient.getKeysByPattern(`CONVERT_`)
      return res.json({
        conversions: toConvert,
        totalCount: toConvert.length,
      })
    } catch (error) {
      logger.error("Error fetching retentions" + error)
      return res.status(400).json({
        message: `Error fetching retentions: ${error}`,
      })
    }
  }
}

export default new ConversionController()
