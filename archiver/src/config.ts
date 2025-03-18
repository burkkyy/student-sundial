import path from "path"
import * as dotenv from "dotenv"

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

export const API_PORT = process.env.API_PORT || "3001"

export const FRONTEND_URL = process.env.FRONTEND_URL || ""
export const APPLICATION_NAME = process.env.VITE_APPLICATION_NAME || ""

export const DB_HOST = process.env.DB_HOST || ""
export const DB_USERNAME = process.env.DB_USERNAME || ""
export const DB_PASSWORD = process.env.DB_PASSWORD || ""
export const DB_DATABASE = process.env.DB_DATABASE || ""
export const DB_PORT = parseInt(process.env.DB_PORT || "1433")
export const DB_TRUST_SERVER_CERTIFICATE = process.env.DB_TRUST_SERVER_CERTIFICATE === "true"

export const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL || ""

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const AWS_LOGGING_ENABLED = process.env.AWS_LOGGING_ENABLED || "false"
export const AWS_LOGGING_GROUP = process.env.AWS_LOGGING_GROUP || ""
export const AWS_LOGGING_STREAM = process.env.AWS_LOGGING_STREAM || ""
export const AWS_LOGGING_REGION = process.env.AWS_LOGGING_REGION || "ca-central-1"
export const AWS_LOGGING_ACCESS_ID = process.env.AWS_LOGGING_ACCESS_ID || ""
export const AWS_LOGGING_ACCESS_KEY = process.env.AWS_LOGGING_ACCESS_KEY || ""
export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"

export const BLOB_CONNECTIONSTRING = process.env.BLOB_CONNECTIONSTRING || ""
export const BLOB_CONTAINER = process.env.BLOB_CONTAINER || ""

export const PDF_SIGNER_JAR = process.env.PDF_SIGNER_JAR || ""
export const TIMESTAMP_SERVER = process.env.TIMESTAMP_SERVER || ""
export const SSL_FULL_CHAIN_PATH = process.env.SSL_FULL_CHAIN_PATH || ""
export const SSL_CERT_KEY_PATH = process.env.SSL_CERT_KEY_PATH || ""
