import libreoffice from "libreoffice-convert"

export async function bufferToPdf(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    libreoffice.convert(buffer, "pdf", undefined, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
