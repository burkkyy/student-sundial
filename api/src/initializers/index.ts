import { logger } from "@/utils/logger"
import * as fs from "fs/promises"
import * as path from "path"

const NON_INITIALIZER_REGEX = /^index\.(ts|js)$/

export async function importAndExecuteInitializers() {
  const files = await fs.readdir(__dirname)

  return files.reduce(async (previousInitializerAction, file) => {
    await previousInitializerAction

    if (NON_INITIALIZER_REGEX.test(file)) return

    const modulePath = path.join(__dirname, file)
    logger.info(`Running initializer: ${modulePath}`)

    const { default: initializerAction } = await require(modulePath)

    return initializerAction().catch((error: unknown) => {
      logger.error(`Initialization error in ${modulePath}:`, error)
      return Promise.reject(error)
    })
  }, Promise.resolve())
}

if (require.main === module) {
  // TODO: add some kind of middleware that 503s? if initialization failed?
  importAndExecuteInitializers()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.warn("Failed to complete initialization! Error: " + error)
      return process.exit(0)
    })
}
