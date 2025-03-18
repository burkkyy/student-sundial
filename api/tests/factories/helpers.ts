import { isNil, isUndefined } from "lodash"
import { Model } from "@sequelize/core"

export function presence<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value
}

export function ensureModelId<T extends Model & { id: number }>(
  potentialIdFromParams: number | null | undefined,
  potentialModelFromAssociations: T | undefined,
  buildModel: () => T
): {
  id: number
  model: T | undefined
} {
  let model: T | undefined = potentialModelFromAssociations
  let modelId = potentialIdFromParams || model?.id
  if (isNil(modelId)) {
    model = buildModel()
    modelId = model.id
  }

  return {
    id: modelId,
    model: model,
  }
}

/**
 * Support nested save for associated models.
 *
 * TODO: update this function with an exclude list to deal with circular dependencies.
 */
export async function saveModelIfNew<T extends Model>(
  modelInstance: T | undefined,
  options: { nested?: boolean } = {}
): Promise<void> {
  if (isUndefined(modelInstance)) return

  if (options.nested) {
    const modelClass = modelInstance.constructor as typeof Model
    const associations = modelClass.associations
    const associationNames = Object.keys(associations) as (keyof typeof modelInstance)[]

    for (const associationName of associationNames) {
      const associatedInstance = modelInstance[associationName] as Model | Model[] | undefined

      if (isUndefined(associatedInstance)) {
        continue
      }

      if (Array.isArray(associatedInstance)) {
        for (const instance of associatedInstance) {
          await saveModelIfNew(instance, { nested: true })
        }
      } else {
        await saveModelIfNew(associatedInstance, { nested: true })
      }
    }
  }

  if (modelInstance?.isNewRecord) {
    await modelInstance.save()
  }
}
