import {
  AttributeNames,
  Attributes,
  CreationOptional,
  FindOptions,
  Model,
  ModelStatic,
  Op,
  WhereOptions,
} from "@sequelize/core"

import { searchFieldsByTermsFactory } from "@/utils/search-fields-by-terms-factory"

// See api/node_modules/@sequelize/core/lib/model.d.ts -> Model
export abstract class BaseModel<
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  TModelAttributes extends {} = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  declare id: CreationOptional<number>

  static addSearchScope<M extends BaseModel>(this: ModelStatic<M>, fields: AttributeNames<M>[]) {
    const searchScopeFunction = searchFieldsByTermsFactory<M>(fields)
    this.addScope("search", searchScopeFunction)
  }

  // static findByPk<M extends Model, R = Attributes<M>>(
  //   this: ModelStatic<M>,
  //   identifier: unknown,
  //   options: FindByPkOptions<M> & { raw: true; rejectOnEmpty?: false },
  // ): Promise<R | null>;
  // static findByPk<M extends Model, R = Attributes<M>>(
  //   this: ModelStatic<M>,
  //   identifier: unknown,
  //   options: NonNullFindByPkOptions<M> & { raw: true },
  // ): Promise<R>;
  // static findByPk<M extends Model>(
  //   this: ModelStatic<M>,
  //   identifier: unknown,
  //   options: NonNullFindByPkOptions<M>,
  // ): Promise<M>;
  // static findByPk<M extends Model>(
  //   this: ModelStatic<M>,
  //   identifier: unknown,
  //   options?: FindByPkOptions<M>,
  // ): Promise<M | null>;
  public static async findBySlugOrPk<M extends BaseModel>(
    this: ModelStatic<M>,
    slugOrPk: string | number,
    options?: Omit<FindOptions<Attributes<M>>, "where">
  ): Promise<M | null> {
    if (typeof slugOrPk === "number" || !isNaN(Number(slugOrPk))) {
      const primaryKey = slugOrPk
      return this.findByPk(primaryKey, options)
    }

    const slug = slugOrPk
    if (!("slug" in this.getAttributes())) {
      throw new Error(`${this.name} does not have a 'slug' attribute.`)
    }

    return this.findOne({
      ...options,
      // @ts-expect-error - We know that the model has a slug attribute, and are ignoring the TS error
      where: { slug },
    })
  }

  // See api/node_modules/@sequelize/core/lib/model.d.ts -> findAll
  // Taken from https://api.rubyonrails.org/v7.1.0/classes/ActiveRecord/Batches.html#method-i-find_each
  // Enforces sort by id, overwriting any supplied order
  public static async findEach<M extends BaseModel>(
    this: ModelStatic<M>,
    processFunction: (record: M) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel, R = Attributes<M>>(
    this: ModelStatic<M>,
    options: Omit<FindOptions<Attributes<M>>, "raw"> & {
      raw: true
      batchSize?: number
    },
    processFunction: (record: R) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel>(
    this: ModelStatic<M>,
    options: FindOptions<Attributes<M>> & {
      batchSize?: number
    },
    processFunction: (record: M) => Promise<void>
  ): Promise<void>
  public static async findEach<M extends BaseModel, R = Attributes<M>>(
    this: ModelStatic<M>,
    optionsOrFunction:
      | ((record: M) => Promise<void>)
      | (Omit<FindOptions<Attributes<M>>, "raw"> & { raw: true; batchSize?: number })
      | (FindOptions<Attributes<M>> & { batchSize?: number }),
    maybeFunction?: (record: R | M) => Promise<void>
  ): Promise<void> {
    let options:
      | (FindOptions<Attributes<M>> & { batchSize?: number })
      | (Omit<FindOptions<Attributes<M>>, "raw"> & { raw: true; batchSize?: number })

    // TODO: fix types so that process function is M when not raw
    // and R when raw. Raw is usable, just incorrectly typed.
    let processFunction: (record: M) => Promise<void>

    if (typeof optionsOrFunction === "function") {
      options = {}
      processFunction = optionsOrFunction
    } else if (maybeFunction === undefined) {
      throw new Error("findEach requires a processFunction")
    } else {
      options = optionsOrFunction
      processFunction = maybeFunction
    }

    const batchSize = options.batchSize ?? 1000
    let lastId = 0
    let continueProcessing = true

    while (continueProcessing) {
      // TODO: fix where option types so cast is not needed
      const whereClause = {
        ...options.where,
        id: { [Op.gt]: lastId },
      } as WhereOptions<Attributes<M>>
      const records = await this.findAll({
        ...options,
        where: whereClause,
        limit: batchSize,
        order: [["id", "ASC"]],
      })

      for (const record of records) {
        await processFunction(record)
        lastId = record.id
      }

      if (records.length < batchSize) {
        continueProcessing = false
      }
    }
  }
}

export default BaseModel
