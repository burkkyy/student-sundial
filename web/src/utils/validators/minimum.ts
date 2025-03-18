import { isString } from "lodash"

export function minimum(length: number) {
  return (v: unknown): boolean | string => {
    if (isString(v) && v.length < length) {
      return `Must be at least ${length} characters`
    }

    return true
  }
}

export default minimum
