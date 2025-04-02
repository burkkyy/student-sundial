import axios from "axios"
import { isEmpty, isNil } from "lodash"

import {
  AUTH0_DOMAIN,
  AUTH0_MANAGEMENT_AUDIENCE,
  AUTH0_MANAGEMENT_CLIENT_ID,
  AUTH0_MANAGEMENT_CLIENT_SECRET,
} from "@/config"
import logger from "@/utils/logger"

const auth0Api = axios.create({
  baseURL: AUTH0_DOMAIN,
})

const auth0ManagementApi = axios.create({
  baseURL: AUTH0_DOMAIN,
  headers: {
    audience: AUTH0_MANAGEMENT_AUDIENCE,
  },
})

export interface Auth0UserInfo {
  email: string
  firstName: string
  lastName: string
  auth0Subject: string
}

export interface Auth0IdentityInfo {
  provider: string
  user_id: string
  connection: string
  isSocial: boolean
  access_token?: string
  refresh_token?: string
  expires_in?: number
}

export interface Auth0Response {
  sub: string // "auth0|6241ec44e5b4a700693df293"
  given_name: string // "Jane"
  family_name: string // "Doe"
  nickname: string // "Jane"
  name: string // "Jane Doe"
  picture: string // https://s.gravatar.com/avatar/1234567890abcdef1234567890abcdef?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmb.png
  updated_at: string // "2023-10-30T17:25:52.975Z"
  email: string // "janedoe@gmail.com"
  email_verified: boolean // true
}

export class Auth0PayloadError extends Error {
  constructor(data: unknown) {
    super(`Payload from Auth0 is strange or failed for: ${JSON.stringify(data)}`)
    this.name = "Auth0PayloadError"
  }
}

export const auth0Integration = {
  async getUserInfo(token: string): Promise<Auth0UserInfo> {
    const { data }: { data: Auth0Response } = await auth0Api.get("/userinfo", {
      headers: { authorization: token },
    })
    // TODO: write a type for the auth0 response and assert that the payload conforms to it
    if (isNil(data.sub)) {
      // TODO: this might not even be possible?
      throw new Auth0PayloadError(data)
    }
    const firstName = data.given_name || "UNKNOWN"
    const lastName = data.family_name || "UNKNOWN"
    const fallbackEmail = `${firstName}.${lastName}@viu-no-email.ca`

    return {
      auth0Subject: data.sub,
      email: data.email || fallbackEmail,
      firstName,
      lastName,
    }
  },

  async getUserIdentities(sub: string): Promise<Auth0IdentityInfo[]> {
    try {
      const { data: tokenData } = await auth0ManagementApi.post("/oauth/token", {
        client_id: AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: AUTH0_MANAGEMENT_AUDIENCE,
        grant_type: "client_credentials",
      })

      const { data } = await auth0ManagementApi.get(`/api/v2/users/${encodeURIComponent(sub)}`, {
        headers: {
          authorization: `Bearer ${tokenData.access_token}`,
        },
      })

      return data.identities || []
    } catch (error) {
      logger.error("failed to fetch auth0 user identities: ", { error })
      throw error
    }
  },

  async getGoogleAccessToken(sub: string): Promise<string | undefined> {
    const identities = await this.getUserIdentities(sub)
    if (isEmpty(identities)) throw new Error("No auth0 identities were found")

    const googleIdentity = identities.find((id) => id.provider === "google-oauth2")
    if (isNil(googleIdentity)) throw new Error("No auth0 identities were found")

    return googleIdentity.access_token
  },
}

export default auth0Integration
