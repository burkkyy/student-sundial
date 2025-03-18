import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

export const ENVIRONMENT = import.meta.env.MODE

const prodConfig = {
  domain: "https://yukon.eu.auth0.com",
  clientId: "mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo",
  audience: "generic-production",
  apiBaseUrl: "",
  applicationName: "The Vault",
}

const uatConfig = {
  domain: "https://yukon-staging.eu.auth0.com",
  clientId: "11878vWk1pmhwyVQwsr2m2zM3w3e912U",
  audience: "generic-uat",
  apiBaseUrl: "",
  applicationName: "The Vault - UAT",
}

const devConfig = {
  domain: "https://dev-0tc6bn14.eu.auth0.com",
  clientId: "mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo",
  audience: "testing",
  apiBaseUrl: "http://localhost:3000",
  applicationName: "The Vault",
}

const localProductionConfig = {
  domain: "https://dev-0tc6bn14.eu.auth0.com",
  clientId: "mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo",
  audience: "testing",
  apiBaseUrl: "http://localhost:8080",
  applicationName: "The Vault",
}

let config = prodConfig

if (ENVIRONMENT === "production" && window.location.host === "localhost:8080") {
  config = localProductionConfig
} else if (window.location.host === "localhost:8080") {
  config = devConfig
} else if (window.location.host == "yg-wrap-uat.azurewebsites.net") {
  config = uatConfig
}

export const APPLICATION_NAME = config.applicationName

export const API_BASE_URL = config.apiBaseUrl

export const AUTH0_DOMAIN = stripTrailingSlash(config.domain)
export const AUTH0_AUDIENCE = config.audience
export const AUTH0_CLIENT_ID = config.clientId
