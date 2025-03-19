import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

export const ENVIRONMENT = import.meta.env.MODE

const prodConfig = {
  domain: "https://dune-cx.us.auth0.com",
  clientId: "ww5sYMg0xJyZPTbNa3gCfcL0f9JQEolW",
  audience: "thrive",
  apiBaseUrl: "",
  applicationName: "Foresight PM",
}

const devConfig = {
  domain: "https://dune-cx.us.auth0.com",
  clientId: "Bjuzy1WonTyMhuzVbC2BOwDFFg2D8091",
  audience: "thrive",
  apiBaseUrl: "http://localhost:3000",
  applicationName: "Foresight PM - DEV",
}

let config = prodConfig

if (window.location.host == "localhost:8080") config = devConfig

// Generally we use window.location.origin for the redirect_uri but if
// you may want to use a different URL for the redirect_uri. Make sure you
// make the related changes in @/config.js and @/plugins/auth.js
export const APPLICATION_NAME = import.meta.env.VITE_APPLICATION_NAME ?? config.applicationName
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? config.apiBaseUrl

export const AUTH0_DOMAIN = stripTrailingSlash(import.meta.env.VITE_AUTH0_DOMAIN ?? config.domain)
export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE ?? config.audience
export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID ?? config.clientId
