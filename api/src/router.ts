import path from "path"
import fs from "fs"

import {
  Router,
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express"
import { UnauthorizedError } from "express-jwt"
import { template } from "lodash"

import { APPLICATION_NAME, GIT_COMMIT_HASH, NODE_ENV, RELEASE_TAG } from "@/config"
import { logger } from "@/utils/logger"
import migrator from "@/db/migrator"

import { jwtMiddleware, ensureAndAuthorizeCurrentUser } from "@/middlewares"

import {
  ArchiveItemAuditsController,
  ArchiveItemFilesController,
  ArchiveItemsController,
  CategoriesController,
  CurrentUserController,
  DecisionsController,
  IntegrationController,
  RetentionsController,
  SourcesController,
  UsersController,
} from "@/controllers"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  return res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

router.use("/migrate", migrator.migrationRouter)

router.route("/api/integrations/:sourceId").post(IntegrationController.create)

// api routes
router.use("/api", jwtMiddleware, ensureAndAuthorizeCurrentUser)

router.route("/api/current-user").get(CurrentUserController.show)

router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:id")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

router.route("/api/sources").get(SourcesController.index).post(SourcesController.create)
router
  .route("/api/sources/:id")
  .get(SourcesController.show)
  .patch(SourcesController.update)
  .delete(SourcesController.destroy)

router.route("/api/retentions").get(RetentionsController.index).post(RetentionsController.create)
router
  .route("/api/retentions/:id")
  .get(RetentionsController.show)
  .patch(RetentionsController.update)
  .delete(RetentionsController.destroy)

router.route("/api/categories").get(CategoriesController.index).post(CategoriesController.create)

router
  .route("/api/categories/:id")
  .get(CategoriesController.show)
  .patch(CategoriesController.update)
  .delete(CategoriesController.destroy)

router
  .route("/api/archive-items")
  .get(ArchiveItemsController.index)
  .post(ArchiveItemsController.create)
router
  .route("/api/archive-items/:id")
  .get(ArchiveItemsController.show)
  .patch(ArchiveItemsController.update)
  .delete(ArchiveItemsController.destroy)

router.route("/api/archive-items/:archiveItemId/files/:fileId").get(ArchiveItemFilesController.show)
router.route("/api/archive-items/:archiveItemId/audits").get(ArchiveItemAuditsController.index)

router.route("/api/decisions").get(DecisionsController.index).post(DecisionsController.create)
router
  .route("/api/decisions/:id")
  .get(DecisionsController.show)
  .patch(DecisionsController.update)
  .delete(DecisionsController.destroy)

// if no other routes match, return a 404
router.use("/api", (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Not Found" })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof UnauthorizedError) {
    logger.error(err)
    return res.status(err.status).json({ message: err.inner.message })
  }

  /* if (err instanceof DatabaseError) {
    logger.error(err)
    return res.status(422).json({ message: "Invalid query against database." })
  }
 */
  logger.error(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

// if no other non-api routes match, send the pretty 404 page
if (NODE_ENV == "development") {
  router.use("/", (_req: Request, res: Response) => {
    const templatePath = path.resolve(__dirname, "web/404.html")
    try {
      const templateString = fs.readFileSync(templatePath, "utf8")
      const compiledTemplate = template(templateString)
      const result = compiledTemplate({
        applicationName: APPLICATION_NAME,
        releaseTag: RELEASE_TAG,
        gitCommitHash: GIT_COMMIT_HASH,
      })
      return res.status(404).send(result)
    } catch (error) {
      logger.error(error)
      return res.status(500).send(`Error building 404 page: ${error}`)
    }
  })
}

export default router
