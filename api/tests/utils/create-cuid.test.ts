import createCuid from "@/utils/create-cuid"

describe("api/src/utils/create-cuid.ts", () => {
  describe("createCuid", () => {
    test("when ran, it returns a string", () => {
      const id = createCuid()

      expect(id).to.be.a("string")
    })

    test("when ran, it does not include undefined", () => {
      const id = createCuid()

      expect(id).not.to.include("undefined")
    })

    test("when ran without a length, it returns an 8 character string", () => {
      const id = createCuid()

      expect(id).to.have.lengthOf(8)
    })

    test("when ran with a length of 5, it returns a 5 character string", () => {
      const id = createCuid(5)

      expect(id).to.have.lengthOf(5)
    })
  })
})
