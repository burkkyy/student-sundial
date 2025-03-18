import { auth0Integration } from "@/integrations"
import { User } from "@/models"
import { EnsureFromAuth0TokenService } from "@/services/users"

import { userFactory } from "@/factories"

vi.mock("@/integrations", () => ({
  auth0Integration: {
    getUserInfo: vi.fn(),
  },
}))
const mockedAuth0Integration = vi.mocked(auth0Integration)

describe("api/src/services/users/ensure-from-auth0-token-service.ts", () => {
  describe("EnsureFromAuth0TokenService", () => {
    describe("#perform", () => {
      test("when user with Auth0 subject, matching Auth0 subject returned by Auth0 integration, exists in database, returns user", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        const user = await userFactory.create({ auth0Subject })

        const getUserInfoResult = {
          auth0Subject,
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        }
        mockedAuth0Integration.getUserInfo.mockResolvedValue(getUserInfoResult)

        // Act
        const result = await EnsureFromAuth0TokenService.perform(token)

        // Assert
        expect(result).to.be.instanceOf(User).with.property("id", user.id)
      })

      test("when user with Auth0 subject, matching Auth0 subject returned by Auth0 integration, does not exist in database, creates and returns user", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"

        const getUserInfoResult = {
          auth0Subject,
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        }
        mockedAuth0Integration.getUserInfo.mockResolvedValue(getUserInfoResult)


        // Assert
        expect.assertions(2)
        let result
        await expect(
          async () => {
            // Act
            result = await EnsureFromAuth0TokenService.perform(token)
            return result
          }
        ).toChange(() => User.count(), { from: 0, to: 1 })
        expect(result).to.be.instanceOf(User).with.property("authSubject", auth0Subject)
      })

      test("when user with Auth0 subject, matching email returned by Auth0 integration, exists in database, updates and returns user", async () => {
        // Arrange
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        const email = "jane.doe@example.com"
        const user = await userFactory.create({ email, auth0Subject: email })

        const getUserInfoResult = {
          auth0Subject,
          email,
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        }
        mockedAuth0Integration.getUserInfo.mockResolvedValue(getUserInfoResult)

        // Act
        const result = await EnsureFromAuth0TokenService.perform(token)

        // Assert
        expect(result).to.be.instanceOf(User).and.to.include({
          id: user.id,
          authSubject: auth0Subject,
          email: user.email,
        })
      })
    })
  })
})
