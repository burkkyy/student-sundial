import { last } from "lodash"

export function toSentence(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return items.join(" and ")

  const itemsExceptLast = items.slice(0, -1).join(", ")
  const lastItem = last(items)
  return `${itemsExceptLast}, and ${lastItem}`
}

export default toSentence
