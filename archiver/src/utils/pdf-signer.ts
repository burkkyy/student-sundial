import { exec } from "child_process"
import { isEmpty } from "lodash"

import logger from "@/utils/logger"

import { PDF_SIGNER_JAR, TIMESTAMP_SERVER, SSL_FULL_CHAIN_PATH, SSL_CERT_KEY_PATH } from "@/config"

if (isEmpty(PDF_SIGNER_JAR)) throw new Error("pdf signer jar filepath is unset.")
if (isEmpty(TIMESTAMP_SERVER)) throw new Error("timestamp server is unset.")
if (isEmpty(SSL_FULL_CHAIN_PATH)) throw new Error("ssl fullchain filepath is unset.")
if (isEmpty(SSL_CERT_KEY_PATH)) throw new Error("ssl cert key filepath is unset.")

export async function signPDFWithPAdES(
  inputPdfFilepath: string,
  outputPdfFilepath: string
): Promise<void> {
  const cmd: string = `java -jar ${PDF_SIGNER_JAR} --input ${inputPdfFilepath} --output ${outputPdfFilepath} --certificate ${SSL_FULL_CHAIN_PATH} --key ${SSL_CERT_KEY_PATH} --timestamp --tsa ${TIMESTAMP_SERVER} --baseline-lt`

  return new Promise((resolve, reject) => {
    exec(cmd, { encoding: "buffer" }, (error, stderr) => {
      if (error) {
        logger.error("open-pdf-sign error:", stderr.toString())
        reject(new Error(`open-pdf-sign error: ${stderr.toString()}`))
        return
      }
      resolve()
    })
  })
}
