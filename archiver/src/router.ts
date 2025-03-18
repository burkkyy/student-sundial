import { Router, type Request, type Response } from "express"

import { GIT_COMMIT_HASH, RELEASE_TAG } from "@/config"
import ConversionController from "@/controllers/conversion-controller"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  return res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// api routes
router.route("/api/conversions").get(ConversionController.index)

// if no other routes match, return a 404
router.use("", (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Not Found" })
})

export default router
