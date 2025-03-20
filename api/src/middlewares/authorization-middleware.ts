import { type NextFunction, type Response } from "express"
import { type Request as JwtRequest } from "express-jwt"
import { isNil } from "lodash"

import auth0Integration, { Auth0PayloadError } from "@/integrations/auth0-integration"
import { User } from "@/models"
import { logger } from "@/utils/logger"

export type AuthorizationRequest = JwtRequest & {
  currentUser?: User | null
}

async function findOrCreateUserFromAuth0Token(token: string): Promise<User | null> {
  const { auth0Subject, email, firstName, lastName } = await auth0Integration.getUserInfo(token)

  const existingUser = await User.findOne({
    where: { auth_subject: auth0Subject },
  })

  await existingUser?.fetchRoles()

  if (existingUser) {
    return existingUser
  }

  const existingUserByEmail = await User.findOne({
    where: { email },
  })

  await existingUserByEmail?.fetchRoles()

  if (existingUserByEmail) {
    return existingUserByEmail
  }

  await User.create({
    auth_subject: auth0Subject,
    email,
    first_name: firstName,
    last_name: lastName,
  })

  const newUser = await User.findOne({
    where: { auth_subject: auth0Subject },
  })

  await newUser?.fetchRoles()

  return newUser
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
    where: { auth_subject: req.auth?.sub || "" },
  })

  await user?.fetchRoles()

  if (!isNil(user)) {
    req.currentUser = user
    return next()
  }

  try {
    const token = req.headers.authorization || ""
    const user = await findOrCreateUserFromAuth0Token(token)
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
