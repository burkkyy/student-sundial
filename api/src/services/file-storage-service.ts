import { v4 as uuidV4 } from "uuid"
import { BlobServiceClient } from "@azure/storage-blob"
import { BLOB_CONNECTIONSTRING, BLOB_CONTAINER } from "@/config"

export class FileStorageService {
  private serviceClient
  private containerClient

  constructor() {
    this.serviceClient = BlobServiceClient.fromConnectionString(BLOB_CONNECTIONSTRING)
    this.containerClient = this.serviceClient.getContainerClient(BLOB_CONTAINER)
  }

  makeKey(): string {
    return uuidV4()
  }

  async uploadFile(key: string, localFilePath: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key)
    const uploadBlobResponse = await blockBlobClient.uploadFile(localFilePath)
    return uploadBlobResponse
  }

  async downloadFile(key: string) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key)

    return await blockBlobClient.downloadToBuffer()
  }
}
