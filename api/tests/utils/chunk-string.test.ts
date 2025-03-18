import chunkString from "@/utils/chunk-string"

describe("api/src/utils/chunk-string.ts", () => {
  describe("chunkString", () => {
    test.each([
      {
        input: "1234",
        chunkSize: 4,
        output: ["1234"],
      },
      {
        input: "12345678",
        chunkSize: 4,
        output: ["1234", "5678"],
      },
      {
        input: "1234567890",
        chunkSize: 4,
        output: ["12", "3456", "7890"],
      },
      {
        input: "1234567890",
        chunkSize: 5,
        output: ["12345", "67890"],
      },
    ])(
      "when input is $input and chunkSize is $chunkSize, splits correctly",
      ({ input, chunkSize, output }) => {
        // Arrange
        const string = input
        const size = chunkSize

        // Act
        const result = chunkString(string, size)

        // Assert
        expect(result).toEqual(output)
      }
    )
  })
})
