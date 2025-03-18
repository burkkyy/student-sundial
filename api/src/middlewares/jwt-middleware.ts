import { expressjwt as jwt } from "express-jwt"
import jwksRsa, { type GetVerificationKey } from "jwks-rsa"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE, NODE_ENV } from "@/config"
import { logger } from "@/utils/logger"

if (NODE_ENV !== "test") {
  logger.info(`AUTH0_DOMAIN - ${AUTH0_DOMAIN}/.well-known/jwks.json`)
}

// TODO: investigate converting this to an integration or utility of the authorization middleware
export const jwtMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [`${AUTH0_DOMAIN}/`],
  algorithms: ["RS256"],
})

export default jwtMiddleware
