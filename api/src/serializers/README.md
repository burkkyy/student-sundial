# Serializers

Serializers take model data, and add or remove fields. They are used to convert a database representation of a model to a front-end representation of a model. This might include removing fields that should not be exposed to the front-end, or adding fields that are derived from the database representation.

Serializers are used in controllers to convert from a database representation to a front-end data packet. Serializers should not be used for general data formating such as date or money formatting, as formatting those kinds of things in the front-end is generally more flexible.

e.g. Usage in a Controller might look like this
Note that the BaseSerializer supports passing either an array or a single model to the `perform` method.

```typescript
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { CreateService } from "@/services/users"
import { IndexSerializer } from "@/serializers/users"
import BaseController from "@/controllers/base-controller"

export class FormsController extends BaseController {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedUsers = UsersPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedUsers.count({ where })
      const users = await scopedUsers.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedUsers = IndexSerializer.perform(users)
      return this.response.json({
        users: serializedUsers,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching users" + error)
      return this.response.status(400).json({
        message: `Error fetching users: ${error}`,
      })
    }
  }

  async show() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this user",
        })
      }

      return this.response.json({ user, policy })
    } catch (error) {
      logger.error("Error fetching user" + error)
      return this.response.status(400).json({
        message: `Error fetching user: ${error}`,
      })
    }
  }
}
```
