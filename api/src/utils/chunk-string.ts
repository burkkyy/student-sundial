/**
 * Splits a string into chunks of a given size.
 * Prefers first chunk to be the smallest, if string cannot be split evenly.
 *
 * e.g.
 *   chunkString("1234567890", 4) => ["12", "3456", "7890"]
 */
export function chunkString(string: string, chunkSize: number = 4): string[] {
  const result = []
  let currentIndex = string.length

  // Loop from the end of the string and slice groups of chunkSize
  while (currentIndex > 0) {
    const start = Math.max(currentIndex - chunkSize, 0)
    const chunk = string.slice(start, currentIndex)
    result.unshift(chunk)
    currentIndex -= chunkSize
  }

  return result
}

export default chunkString
