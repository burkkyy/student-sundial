import axios from "axios"

import { AUTH0_DOMAIN } from "@/config"

const auth0Api = axios.create({
  baseURL: AUTH0_DOMAIN,
})

export interface Auth0UserInfo {
  email: string
  firstName: string
  lastName: string
  auth0Subject: string
  externalDirectoryIdentifier: string
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
  oid?: string // 11111111-2222-3333-4444-555555555555"
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

    const firstName = data.given_name || "UNKNOWN"
    const lastName = data.family_name || "UNKNOWN"
    const fallbackEmail = `${firstName}.${lastName}@yukon-no-email.ca`
    const email = data.email || fallbackEmail

    // for external (non AzureAD) users, the oid is not in the userinfo response
    // this ensures that something makes it into that field to stop the app from constantly checking
    // alternatively, if they aren't in the directory, maybe this should fail...
    const externalDirectoryIdentifier = data.oid || `NOT_IN_DIRECTORY-${email}`

    return {
      auth0Subject: data.sub,
      email,
      firstName,
      lastName,
      externalDirectoryIdentifier,
    }
  },
}

export default auth0Integration
