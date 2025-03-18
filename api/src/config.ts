import path from "path"
import * as dotenv from "dotenv"

import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

export const NODE_ENV = process.env.NODE_ENV || "development"

let dotEnvPath
switch (process.env.NODE_ENV) {
  case "test":
    dotEnvPath = path.resolve(__dirname, "../.env.test")
    break
  case "production":
    dotEnvPath = path.resolve(__dirname, "../.env.production")
    break
  default:
    dotEnvPath = path.resolve(__dirname, "../.env.development")
}

dotenv.config({ path: dotEnvPath })

if (process.env.NODE_ENV !== "test") {
  console.log("Loading env: ", dotEnvPath)
}

export const API_PORT = process.env.API_PORT || "3000"
export const JOB_PORT = process.env.JOB_PORT || "3001"

export const FRONTEND_URL = process.env.FRONTEND_URL || ""
export const AUTH0_DOMAIN = stripTrailingSlash(process.env.VITE_AUTH0_DOMAIN || "")
export const AUTH0_AUDIENCE = process.env.VITE_AUTH0_AUDIENCE
export const AUTH0_REDIRECT = process.env.VITE_AUTH0_REDIRECT || process.env.FRONTEND_URL || ""

export const APPLICATION_NAME = process.env.VITE_APPLICATION_NAME || ""

export const DB_HOST = process.env.DB_HOST || ""
export const DB_USERNAME = process.env.DB_USERNAME || ""
export const DB_PASSWORD = process.env.DB_PASSWORD || ""
export const DB_DATABASE = process.env.DB_DATABASE || ""
export const DB_PORT = parseInt(process.env.DB_PORT || "1433")
export const DB_TRUST_SERVER_CERTIFICATE = process.env.DB_TRUST_SERVER_CERTIFICATE === "true"

export const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL || ""

export const DB_HEALTH_CHECK_INTERVAL_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_INTERVAL_SECONDS || "5"
)
export const DB_HEALTH_CHECK_TIMEOUT_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_TIMEOUT_SECONDS || "10"
)
export const DB_HEALTH_CHECK_RETRIES = parseInt(process.env.DB_HEALTH_CHECK_RETRIES || "3")
export const DB_HEALTH_CHECK_START_PERIOD_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_START_PERIOD_SECONDS || "5"
)

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const RUN_SCHEDULER = process.env.RUN_SCHEDULER || "false"

export const AD_CLIENT_ID = process.env.AD_CLIENT_ID || ""
export const AD_CLIENT_SECRET = process.env.AD_CLIENT_SECRET || ""
export const AD_TENANT_ID = process.env.AD_TENANT_ID || ""

export const AWS_LOGGING_ENABLED = process.env.AWS_LOGGING_ENABLED || "false"
export const AWS_LOGGING_GROUP = process.env.AWS_LOGGING_GROUP || ""
export const AWS_LOGGING_STREAM = process.env.AWS_LOGGING_STREAM || ""
export const AWS_LOGGING_REGION = process.env.AWS_LOGGING_REGION || "ca-central-1"
export const AWS_LOGGING_ACCESS_ID = process.env.AWS_LOGGING_ACCESS_ID || ""
export const AWS_LOGGING_ACCESS_KEY = process.env.AWS_LOGGING_ACCESS_KEY || ""
export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"

export const MAIL_FROM = process.env.MAIL_FROM || "digital-vault@yukon.ca"
export const MAIL_HOST = process.env.MAIL_HOST || "smtp.gov.yk.ca"
export const MAIL_PORT = parseInt(process.env.MAIL_PORT || "25")
export const MAIL_SERVICE = process.env.MAIL_SERVICE || "Outlook365"
// Only set MAIL_USER and MAIL_PASS if you need to authenticate to the mail server
// i.e. if the server on the public internet rather than inside the YNet network.
export const MAIL_USER = process.env.MAIL_USER || ""
export const MAIL_PASS = process.env.MAIL_PASS || ""

export const BLOB_CONNECTIONSTRING = process.env.BLOB_CONNECTIONSTRING || ""
export const BLOB_CONTAINER = process.env.BLOB_CONTAINER || ""
