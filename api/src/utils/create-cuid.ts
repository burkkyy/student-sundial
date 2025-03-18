import { init } from "@paralleldrive/cuid2"
import { getRandomValues } from "crypto"

const MAX_UINT32_VALUE = 0xffffffff
const container = new Uint32Array(1)

function secureRandom() {
  getRandomValues(container)
  // Normalize to the same range as Math.random() (0 to 1)
  return container[0] / MAX_UINT32_VALUE
}

const createIdFunctionMap = new Map<number, () => string>()

// The init function returns a custom createId function with the specified
// configuration. All configuration properties are optional.
export const createCuid = (length: number = 8) => {
  const cachedCreateIdFunction = createIdFunctionMap.get(length)
  if (cachedCreateIdFunction !== undefined) {
    return cachedCreateIdFunction()
  }

  const createId = init({
    // A custom random function with the same API as Math.random.
    // You can use this to pass a cryptographically secure random function.
    random: secureRandom,
    // the length of the id
    length,
    // A custom fingerprint for the host environment. This is used to help
    // prevent collisions when generating ids in a distributed system.
    // fingerprint: "a-custom-host-fingerprint",
  })

  createIdFunctionMap.set(length, createId)

  return createId()
}

export default createCuid
