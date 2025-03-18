import {
  AttributeNames,
  Attributes,
  FindOptions,
  Model,
  Op,
  WhereOptions,
  sql,
  where,
} from "@sequelize/core"

import arrayWrap from "@/utils/array-wrap"

/**
 * Generates a search scope for Sequelize models that allows for custom SQL conditions per term.
 */
export function searchFieldsByTermsFactory<M extends Model>(
  fields: AttributeNames<M>[]
): (termOrTerms: string | string[]) => FindOptions<Attributes<M>> {
  return (termOrTerms: string | string[]): FindOptions<Attributes<M>> => {
    const terms = arrayWrap(termOrTerms)
    if (terms.length === 0) {
      return {}
    }

    // TODO: rebuild as successive scope calls once
    // https://github.com/sequelize/sequelize/issues/17304 is fixed
    // (we would no longer need the and operator in the where clause)
    const whereQuery: {
      [Op.and]?: WhereOptions<M>[]
    } = {}

    const whereConditions: WhereOptions<M>[] = terms.map((term: string) => {
      const termPattern = `%${term}%`
      const fieldsQuery = fields.map((field) => {
        return where(sql.fn("LOWER", sql.attribute(field)), Op.like, termPattern)
      })

      return {
        [Op.or]: fieldsQuery,
      }
    })

    whereQuery[Op.and] = whereConditions

    return {
      where: whereQuery,
    }
  }
}

export default searchFieldsByTermsFactory
