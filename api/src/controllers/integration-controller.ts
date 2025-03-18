import logger from "@/utils/logger"
import { isArray, isNil, uniqBy } from "lodash"
import { ArchiveItem, ArchiveItemAudit, Category, Source, User, UserPermission } from "@/models"
import { IntegrationsPolicy } from "@/policies"
import BaseController from "@/controllers/base-controller"
import { CreateIntegrationService } from "@/services/archive-items"
import { Op } from "@sequelize/core"
import { DateTime } from "luxon"
import { FRONTEND_URL } from "@/config"

export class IntegrationController extends BaseController<ArchiveItem> {
  async create() {
    try {
      const source = await Source.findByPk(this.request.params.sourceId)
      if (isNil(source) || isNil(source.referrers)) {
        return this.response.status(404).json({
          message: "Source not found",
        })
      }

      if (!source.referrers.includes(this.request.ip ?? "")) {
        return this.response.status(401).json({
          message: "Source not authorized from this IP",
        })
      }

      const policy = this.buildPolicy(source)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create items",
        })
      }

      if (isNil(this.request.body.categories) || this.request.body.categories.length === 0) {
        return this.response.status(401).json({
          message: "Category is required",
        })
      }

      const categoryNames = this.request.body.categories
        .split(",")
        .map((categoryName: string) => categoryName.trim())
        .filter((categoryName: string) => !isNil(categoryName))

      const matchingCategories = await Category.findAll({
        where: {
          name: { [Op.in]: categoryNames },
        },
        include: ["retention"],
      })

      if (
        isNil(matchingCategories) ||
        matchingCategories.length === 0 ||
        matchingCategories.length != categoryNames.length
      ) {
        return this.response.status(401).json({
          message: "Categories do not exist",
        })
      }
      const matchingCategoryIds = matchingCategories.map((category) => category.id)

      const retentionOptions = uniqBy(
        matchingCategories.map((category) => category.retention),
        "id"
      ).filter((retention) => !isNil(retention))

      let retentionName = ""
      let calculatedExpireDate = DateTime.now()
      let expireAction = ""

      for (const retention of retentionOptions) {

        console.log(retention)

        if (retention.retentionDate) {
          const calculatedExpireDate1 = DateTime.fromJSDate(retention.retentionDate)
          console.log(calculatedExpireDate1, calculatedExpireDate)

          if (calculatedExpireDate1 > calculatedExpireDate) {
            retentionName = retention.name
            expireAction = retention.expireAction
            calculatedExpireDate = calculatedExpireDate1 as DateTime
          }
        } else if (retention.retentionDays) {
          const calculatedExpireDate1 = DateTime.now()
            .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
            .toUTC()
            .plus({ days: retention.retentionDays })

          if (calculatedExpireDate1 > calculatedExpireDate) {
            retentionName = retention.name
            expireAction = retention.expireAction
            calculatedExpireDate = calculatedExpireDate1 as DateTime
          }
        }
      }
      if (retentionName === "" || expireAction === "") {
        return this.response.status(401).json({
          message: "Retention is invalid",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const archiveItem = await CreateIntegrationService.perform({
        ...permittedAttributes,
        categoryIds: matchingCategoryIds,
        files: this.request.body.files,
        isDecision: false,
        source,
        retentionName,
        calculatedExpireDate: calculatedExpireDate.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        expireAction,
        securityLevel: 2,
      })

      const permissionsList = this.request.body.emails
        .split(",")
        .map((email: string) => email.trim())

      for (const item of permissionsList) {
        const user = await User.findOne({ where: { email: item } })

        UserPermission.create({
          canViewAttachments: true,
          archiveItemId: archiveItem.id,
          userEmail: user ? null : item,
          userId: user?.id,
        })
      }

      await ArchiveItemAudit.create({
        archiveItemId: archiveItem.id,
        action: "Created",
        description: `${source.name} created item`,
      })

      console.log(`${FRONTEND_URL}/archive-items/${archiveItem.id}/view`)

      const data = {
        id: archiveItem.id,
        url: `${FRONTEND_URL}/archive-items/${archiveItem.id}/view`,
        submittedAt: archiveItem.submittedAt,
      }

      return this.response.status(201).json({ data })
    } catch (error) {
      logger.error("Error creating archive item" + error)
      return this.response.status(422).json({
        message: `Error creating archive item: ${error}`,
      })
    }
  }

  private buildPolicy(source: Source, archiveItem: ArchiveItem = ArchiveItem.build()) {
    return new IntegrationsPolicy(source, archiveItem)
  }
}

export default IntegrationController
