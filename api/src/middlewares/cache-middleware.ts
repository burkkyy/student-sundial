import { NextFunction, Request, Response } from "express"
import { createHash } from "crypto"
import cache from "@/db/cache-client"

export async function userSpecificCacheReader(req: Request, _res: Response, next: NextFunction) {
  if (req.method == "GET") {
    console.log("-----CHECKING CACHE")
    const key = `${req.headers.authorization}_${req.path}`
    const hash = createHash("sha256").update(key).digest("hex")
    console.log("-----HASH IS", hash)
    const client = await cache.getClient()

    const val = await client.getValue(hash)

    if (val) {
      console.log("-----FOUND CACHE VALUE", val)
    }
  }

  next()
}
