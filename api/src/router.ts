import path from "path"
import fs from "fs"

import { Router, type Request, type Response, ErrorRequestHandler, NextFunction } from "express"
import { UnauthorizedError } from "express-jwt"
import { template } from "lodash"

import { APPLICATION_NAME, GIT_COMMIT_HASH, NODE_ENV, RELEASE_TAG } from "@/config"
import migrator from "@/db/migrator"

import jwtMiddleware from "@/middlewares/jwt-middleware"
import { ensureAndAuthorizeCurrentUser } from "@/middlewares/authorization-middleware"

import {
  BlocksController,
  CoursesController,
  CourseTasksController,
  CurrentUserController,
  EnrollmentsController,
  GoogleCalendarController,
  SectionBlocksController,
  SectionsController,
  TeachingsController,
  TimetableUploadController,
  UsersController,
} from "@/controllers"

import { logger } from "@/utils/logger"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  return res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

router.use("/api", jwtMiddleware, ensureAndAuthorizeCurrentUser)
router.use("/migrate", migrator.migrationRouter)

// Users
router.route("/api/current-user").get(CurrentUserController.show).put(CurrentUserController.update)
router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:userId")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

// Time Table file upload
router.route("/api/timetable/upload").post(TimetableUploadController.create)

// Google Calendar
router
  .route("/api/google-calendar")
  .get(GoogleCalendarController.index)
  .post(GoogleCalendarController.create)

// Blocks
router.route("/api/blocks").get(BlocksController.index).post(BlocksController.create)
router
  .route("/api/blocks/:blockId")
  .get(BlocksController.show)
  .patch(BlocksController.update)
  .delete(BlocksController.destroy)

// Courses
router.route("/api/courses").get(CoursesController.index).post(CoursesController.create)
router
  .route("/api/courses/:courseId")
  .get(CoursesController.show)
  .patch(CoursesController.update)
  .delete(CoursesController.destroy)

// Course Tasks
router
  .route("/api/course-tasks")
  .get(CourseTasksController.index)
  .post(CourseTasksController.create)
router
  .route("/api/course-tasks/:courseTaskId")
  .get(CourseTasksController.show)
  .patch(CourseTasksController.update)
  .delete(CourseTasksController.destroy)

// Enrollemnts
router.route("/api/enrollments").get(EnrollmentsController.index).post(EnrollmentsController.create)
router
  .route("/api/enrollments/:enrollmentId")
  .get(EnrollmentsController.show)
  .patch(EnrollmentsController.update)
  .delete(EnrollmentsController.destroy)

// Section Blocks
router
  .route("/api/section-blocks")
  .get(SectionBlocksController.index)
  .post(SectionBlocksController.create)
router
  .route("/api/section-blocks/:sectionBlockId")
  .get(SectionBlocksController.show)
  .patch(SectionBlocksController.update)
  .delete(SectionBlocksController.destroy)

// Section Blocks
router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:userId")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

// Sections
router.route("/api/sections").get(SectionsController.index).post(SectionsController.create)
router
  .route("/api/sections/:sectionId")
  .get(SectionsController.show)
  .patch(SectionsController.update)
  .delete(SectionsController.destroy)

// Teachings
router.route("/api/teachings").get(TeachingsController.index).post(TeachingsController.create)
router
  .route("/api/teachings/:teachingId")
  .get(TeachingsController.show)
  .patch(TeachingsController.update)
  .delete(TeachingsController.destroy)

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
