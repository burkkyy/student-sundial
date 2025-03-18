import { determineFiscalYear } from "@/utils/determine-fiscal-year"

describe("api/src/utils/determine-fiscal-year.ts", () => {
  describe("determineFiscalYear", () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test("returns the current year when the date is exactly April 1st", () => {
      // Arrange
      const date = new Date(2024, 3, 1) // April 1st, 2024
      vi.setSystemTime(date)

      // Act
      const fiscalYear = determineFiscalYear()

      // Assert
      expect(fiscalYear).toBe(2024)
    })

    test("returns the previous year when the date is exactly March 31st", () => {
      // Arrange
      const date = new Date(2024, 2, 31) // March 31st, 2024
      vi.setSystemTime(date)

      // Act
      const fiscalYear = determineFiscalYear()

      // Assert
      expect(fiscalYear).toBe(2023)
    })

    test("returns the previous year when the date is before April 1st", () => {
      // Arrange
      const date = new Date(2024, 1, 15) // February 15th, 2024
      vi.setSystemTime(date)

      // Act
      const fiscalYear = determineFiscalYear()

      // Assert
      expect(fiscalYear).toBe(2023)
    })

    test("returns the current year when the date is after April 1st", () => {
      // Arrange
      const date = new Date(2024, 5, 15) // June 15th, 2024
      vi.setSystemTime(date)

      // Act
      const fiscalYear = determineFiscalYear()

      // Assert
      expect(fiscalYear).toBe(2024)
    })
  })
})
