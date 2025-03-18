import { Op, sql, where } from "@sequelize/core"

import searchFieldsByTermsFactory from "@/utils/search-fields-by-terms-factory"

describe("api/src/utils/search-fields-by-terms-factory.ts", () => {
  describe("searchFieldsByTermsFactory", () => {
    test("when given some fields, it builds a scope search on those fields", () => {
      // Arrange
      const fields = ["name", "description", "acronym"]
      const searchScope = searchFieldsByTermsFactory(fields)
      const terms = ["aaa", "bbb", "ccc"]

      // Act
      const result = searchScope(terms)

      // Assert
      expect(result).toEqual({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                where(sql.fn("LOWER", sql.attribute("name")), Op.like, "%aaa%"),
                where(sql.fn("LOWER", sql.attribute("description")), Op.like, "%aaa%"),
                where(sql.fn("LOWER", sql.attribute("acronym")), Op.like, "%aaa%"),
              ],
            },
            {
              [Op.or]: [
                where(sql.fn("LOWER", sql.attribute("name")), Op.like, "%bbb%"),
                where(sql.fn("LOWER", sql.attribute("description")), Op.like, "%bbb%"),
                where(sql.fn("LOWER", sql.attribute("acronym")), Op.like, "%bbb%"),
              ],
            },
            {
              [Op.or]: [
                where(sql.fn("LOWER", sql.attribute("name")), Op.like, "%ccc%"),
                where(sql.fn("LOWER", sql.attribute("description")), Op.like, "%ccc%"),
                where(sql.fn("LOWER", sql.attribute("acronym")), Op.like, "%ccc%"),
              ],
            },
          ],
        },
      })
    })

    test("when given a single term, it builds a scope search on that term", () => {
      // Arrange
      const fields = ["name", "description", "acronym"]
      const searchScope = searchFieldsByTermsFactory(fields)
      const term = "aaa"

      // Act
      const result = searchScope(term)

      // Assert
      expect(result).toEqual({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                where(sql.fn("LOWER", sql.attribute("name")), Op.like, "%aaa%"),
                where(sql.fn("LOWER", sql.attribute("description")), Op.like, "%aaa%"),
                where(sql.fn("LOWER", sql.attribute("acronym")), Op.like, "%aaa%"),
              ],
            },
          ],
        },
      })
    })
  })
})
