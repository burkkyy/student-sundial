import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { ArchiveItem, ArchiveItemCategory, ArchiveItemFile, User } from "@/models"
import { ArchiveItemStatus } from "@/models/archive-item"
import BaseService from "@/services/base-service"
import { FileStorageService } from "../file-storage-service"

export type DecisionCreationAttributes = Partial<CreationAttributes<ArchiveItem>> & {
  files: File[] | null
  categoryIds: string[] | number[] | null
  currentUser: User
}

export class CreateService extends BaseService {
  constructor(private attributes: DecisionCreationAttributes) {
    super()
  }

  async perform(): Promise<ArchiveItem> {
    const {
      title,
      retentionName,
      calculatedExpireDate,
      expireAction,
      securityLevel,
      decisionText,
      ...optionalAttributes
    } = this.attributes

    const status = ArchiveItemStatus.ACCEPTED

    //if (!isArray(categories)) this .categories = JSON.parse(optionalAttributes.)
    if (isNil(title)) {
      throw new Error("Title is required")
    }
    if (isNil(retentionName)) {
      throw new Error("Retention Policy is required")
    }
    if (isNil(calculatedExpireDate)) {
      throw new Error("Expires on is required")
    }
    if (isNil(expireAction)) {
      throw new Error("Expire action is required")
    }
    if (isNil(status)) {
      throw new Error("Status is required")
    }
    if (isNil(securityLevel)) {
      throw new Error("Security level is required")
    }
    if (isNil(title)) {
      throw new Error("Title is required")
    }
    if (isNil(decisionText)) {
      throw new Error("Decision is required")
    }

    return db.transaction(async (transaction) => {
      const archiveItem = await ArchiveItem.create(
        {
          ...optionalAttributes,
          isDecision: true,
          decisionText,
          title,
          retentionName,
          calculatedExpireDate,
          expireAction,
          status,
          securityLevel,
          userId: this.attributes.currentUser.id,
        },
        { transaction }
      )

      if (!isNil(this.attributes.categoryIds)) {
        for (const categoryId of this.attributes.categoryIds) {
          await ArchiveItemCategory.create(
            {
              archiveItemId: archiveItem.id,
              categoryId: parseInt(`${categoryId}`),
              setByUserId: this.attributes.currentUser.id,
            },
            { transaction }
          )
        }
      }

      if (!isNil(this.attributes.files)) {
        const service = new FileStorageService()
        const folderKey = service.makeKey()

        for (const file of this.attributes.files) {
          const fileKey = `${folderKey}/${service.makeKey()}`
          await ArchiveItemFile.create(
            {
              archiveItemId: archiveItem.id,
              originalFileName: file.name,
              originalFileSize: file.size,
              originalMimeType: file.type,
              originalKey: fileKey,
            },
            { transaction }
          )

          // eslint-disable-next-line
          const uploadResp = await service.uploadFile(fileKey, (file as any).path)
          if (uploadResp.errorCode) {
            throw Error("File upload error")
          }
        }
      }

      return archiveItem
    })
  }
}

export default CreateService
