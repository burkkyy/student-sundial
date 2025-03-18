import { REDIS_CONNECTION_URL } from "@/config"
import { logger } from "@/utils/logger"
import { RedisClientType, createClient } from "@redis/client"
import { ScanCommandOptions } from "@redis/client/dist/lib/commands/SCAN"

class CacheClient {
  protected client: RedisClientType
  protected failures: number = 0

  constructor() {
    logger.info(`INIT CACHE: ${REDIS_CONNECTION_URL}`)
    this.client = createClient({ url: REDIS_CONNECTION_URL })

    this.client.on("error", (err) => {
      this.onError(err)
    })
    this.client.on("connect", () => {
      this.failures = 0
      logger.info("Redis Client Connect")
    })

    this.client.dump
  }

  // eslint-disable-next-line
  onError(err: any) {
    if (this.failures < 5) {
      this.failures++
      logger.error(`Redis Connection Error ${this.failures}: ${err.message}`)
    } else if (this.failures == 5) {
      this.failures++
      logger.error("Giving up on Redis")
    }
  }

  async getClient() {
    if (!this.client.isOpen) await this.client.connect()
    return this
  }

  // eslint-disable-next-line
  async setValue(key: string, value: any, expireSeconds = 0) {
    this.client.set(key, value, { EX: expireSeconds })
  }
  // eslint-disable-next-line
  async setValueNoExpire(key: string, value: any) {
    this.client.set(key, value)
  }
  async getValue(key: string) {
    return this.client.get(key)
  }
  async deleteValue(key: string) {
    return this.client.del(key)
  }

  async deleteValuesByPattern(pattern: string) {
    const scanCommand = { MATCH: `${pattern}*` } as ScanCommandOptions
    let cursor = 0

    do {
      const reply = await this.client.scan(cursor, scanCommand)
      cursor = reply.cursor
      const keys = reply.keys

      if (keys.length > 0) {
        await this.client.del(keys)
      }
    } while (cursor !== 0)
  }

  async getKeysByPattern(pattern: string): Promise<string[]> {
    const scanCommand = { MATCH: `${pattern}*` } as ScanCommandOptions
    let cursor = 0
    let matches = new Array<string>()

    do {
      const reply = await this.client.scan(cursor, scanCommand)
      cursor = reply.cursor
      const keys = reply.keys

      if (keys.length > 0) {
        matches = matches.concat(keys)
      }
    } while (cursor !== 0)

    return matches
  }
}

const cache = new CacheClient()

export default cache
