import { type NextFunction, type Response } from "express"
import { type Request as JwtRequest } from "express-jwt"
import { isNil } from "lodash"

import { logger } from "@/utils/logger"
import { Auth0PayloadError } from "@/integrations/auth0-integration"
import { User } from "@/models"
import { Users } from "@/services"

export type AuthorizationRequest = JwtRequest & {
  currentUser?: User | null
}

// Requires api/src/middlewares/jwt-middleware.ts to be run first
// I'd love to merge that code in here at some point, or make all this code a controller "before action"
// I'm uncomfortable with creating users automatically here, I'd rather the front-end requested
// user creation directly, and might switch to that in the future.
export async function ensureAndAuthorizeCurrentUser(
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) {
  const user = await User.findOne({
    where: { auth0Subject: req.auth?.sub || "" },
    include: ["userPermissions"],
  })

  if (!isNil(user)) {
    req.currentUser = user
    return next()
  }

  try {
    const token = req.headers.authorization || ""
    const user = await Users.EnsureFromAuth0TokenService.perform(token)
    req.currentUser = user
    return next()
  } catch (error) {
    if (error instanceof Auth0PayloadError) {
      logger.error(error)
      return res.status(502).json({ message: "External authorization api failed." })
    } else {
      return res.status(401).json({ message: "User authentication failed." })
    }
  }
}

export default ensureAndAuthorizeCurrentUser
