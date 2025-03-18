import acronymize from "@/utils/acronymize"

describe("web/src/utils/acronymize.ts", () => {
  describe(".acronymize", () => {
    test.each([
      {
        name: "Economic Development",
        acronym: "ED",
      },
      {
        name: "Corporate Services",
        acronym: "CS",
      },
      {
        name: "Business and Economic Research",
        acronym: "BER",
      },
      {
        name: "Ends With a Space ",
        acronym: "EWS",
      },
      {
        name: "Has an Extra  Space",
        acronym: "HES",
      },
      {
        name: "Has-Hyphen-1",
        acronym: "HH1"
      },
      {
        name: "Has--Hyphen and White-- --Space",
        acronym: "HHWS"
      },
      {
        name: "Multi Number 123",
        acronym: "MN123"
      }
    ])("when name is $name, acronymizes the name to $acronym", ({ name, acronym }) => {
      // Act
      const result = acronymize(name)

      // Assert
      expect(result).toBe(acronym)
    })
  })
})
