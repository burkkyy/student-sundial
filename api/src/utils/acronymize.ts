export function acronymize(name: string) {
  return name
    .trim()
    .split(/[\s-]+/g)
    .filter((word) => word[0] === word[0].toUpperCase())
    .map((word) => {
      if (!isNaN(parseInt(word[0]))) return word

      return word[0]
    })
    .join("")
}

export default acronymize
