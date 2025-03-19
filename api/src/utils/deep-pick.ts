import { cloneDeep } from "lodash"

/*
Usage:
const object = {
  a: 1,
  b: 2,
  c: {
    d: 4,
    f: 5,
  },
  g: [
    {
      h: 6,
      i: 7,
    },
    {
      h: 8,
      i: 9,
    }
  ],
}

const picked = deepPick(object, ["a", { c: ["d"] }, { g: ["h"] }]);
console.log(picked); // Output: { a: 1, c: { d: 4 }, g: [{ h: 6 }, { h: 8 }] }
// TODO: write some tests and de-garbage this code
*/
export type Path =
  | string
  | {
      [key: string]: (string | Path)[]
    }
export function deepPick(object: any, paths: Path[]) {
  return paths.reduce((result: any, path: Path) => {
    if (typeof path === "string") {
      result[path] = cloneDeep(object[path])
      return result
    } else if (typeof path === "object") {
      Object.entries(path).forEach(([key, nestedPaths]) => {
        const nestedResult = cloneDeep(object[key])
        if (nestedResult === undefined) return

        if (Array.isArray(nestedResult)) {
          result[key] = nestedResult.map((item) => deepPick(item, nestedPaths))
        } else if (typeof nestedResult === "object") {
          result[key] = deepPick(nestedResult, nestedPaths)
        } else {
          result[key] = nestedResult
        }
      })

      return result
    } else {
      throw new Error("Invalid path")
    }
  }, {})
}
