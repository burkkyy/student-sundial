import axios from "axios"
import { isNil } from "lodash"

import { AUTH0_DOMAIN } from "@/config"

const auth0Api = axios.create({
  baseURL: AUTH0_DOMAIN,
})

export interface Auth0UserInfo {
  email: string
  firstName: string
  lastName: string
  auth0Subject: string
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
  constructor(data: any) {
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
    const fallbackEmail = `${firstName}.${lastName}@yukon-no-email.ca`

    return {
      auth0Subject: data.sub,
      email: data.email || fallbackEmail,
      firstName,
      lastName,
    }
  },
}

export default auth0Integration
