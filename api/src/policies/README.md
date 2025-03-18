# Policies

Policies are used to control access to data in a controller, before it is returned to the client.
Polices can be used in the following ways:

1. Build a policy instance and check the controller action matching boolean function.
   Controller#update -> Policy#update

   ```ts
   export class AccessGrantsController extends BaseController {
     async update() {
       const accessGrant = await this.loadAccessGrant()
       if (isNil(accessGrant)) {
         return this.response.status(404).json({ message: "Access grant not found." })
       }

       const policy = this.buildPolicy(accessGrant)
       if (!policy.update()) {
         return this.response
           .status(403)
           .json({ message: "You are not authorized to update access grants on this dataset." })
       }

       const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
       try {
         const updatedAccessGrant = await UpdateService.perform(
           accessGrant,
           permittedAttributes,
           this.currentUser
         )
         return this.response.status(200).json({ accessGrant: updatedAccessGrant })
       } catch (error) {
         return this.response.status(422).json({ message: `Access grant update failed: ${error}` })
       }
     }

     private async loadAccessGrant(): Promise<AccessGrant | null> {
       return AccessGrant.findByPk(this.params.accessGrantId)
     }

     private buildPolicy(accessGrant: AccessGrant) {
       return new AccessGrantsPolicy(this.currentUser, accessGrant)
     }
   }
   ```

2. The previous example also demostrates a second way of using policies. The "permitted attributes" pattern. A policy can also be used to provide an "allow list" of attributes that a user is allowed to submit for a given controller action.

   ```ts
   export class AccessGrantsPolicy extends BasePolicy<AccessGrant> {
     permittedAttributes(): Path[] {
       return ["supportId", "grantLevel", "accessType", "isProjectDescriptionRequired"]
     }
   }
   ```

3. Policies can also be used to restrict the results of an "index" or list action in a controller.
   In this case a bunch of scoping conditions are built up, and then passed to the "apply scope" function. This produces a query that, when executed, will only return the records that the current user is allowed to see.

   ```ts
   export class AccessGrantsController extends BaseController<AccessGrant> {
     async index() {
       const where = this.buildWhere()
       const scopes = this.buildFilterScopes()
       const scopedAccessGrants = AccessGrantsPolicy.applyScope(scopes, this.currentUser)

       const totalCount = await scopedAccessGrants.count({ where })
       const accessGrants = await scopedAccessGrants.findAll({
         where,
         limit: this.pagination.limit,
         offset: this.pagination.offset,
       })

       return this.response.json({ accessGrants, totalCount })
     }
   }
   ```

## Policy#policyScope

The `policyScope` method is used to add a scope to the given model. This scope is permanently added to the model, though it likely shouldn't be used outside of the policy.

i.e.

```ts
export class AccessRequestsPolicy extends PolicyFactory(AccessRequest) {
  static policyScope(user: User): FindOptions<Attributes<AccessRequest>> {
    if (user.isSystemAdmin || user.isBusinessAnalyst) {
      return {}
    }

    if (user.isDataOwner) {
      return {
        include: [
          {
            association: "dataset",
            where: {
              ownerId: user.id,
            },
          },
        ],
      }
    }

    return {
      where: {
        requestorId: user.id,
      },
    }
  }
}
```

can be considered equivalent to

```ts
AccessReqeuest.addScope("policyScope", (user: User) => {
  if (user.isSystemAdmin || user.isBusinessAnalyst) {
    return {}
  }

  if (user.isDataOwner) {
    return {
      include: [
        {
          association: "dataset",
          where: {
            ownerId: user.id,
          },
        },
      ],
    }
  }

  return {
    where: {
      requestorId: user.id,
    },
  }
})
```

# Full Example

Here is a simple example of a controller using a policy to control access to a resource.
The full cases might be more complex, but the "policy" pattern leaves space for that complexity to exist without cluttering the controller.

```ts
export class AccessGrantsController extends BaseController<AccessGrant> {
  async index() {
    const where = this.buildWhere()
    const scopes = this.buildFilterScopes()
    const scopedAccessGrants = AccessGrantsPolicy.applyScope(scopes, this.currentUser)

    const totalCount = await scopedAccessGrants.count({ where })
    const accessGrants = await scopedAccessGrants.findAll({
      where,
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    })

    return this.response.json({ accessGrants, totalCount })
  }

  async create() {
    const accessGrant = await this.buildAccessGrant()
    if (isNil(accessGrant)) {
      return this.response.status(404).json({ message: "Dataset not found." })
    }

    const policy = this.buildPolicy(accessGrant)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to add access grants for this dataset." })
    }

    const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
    try {
      const accessGrant = await CreateService.perform(permittedAttributes, this.currentUser)
      return this.response.status(201).json({ accessGrant })
    } catch (error) {
      return this.response.status(422).json({ message: `Access grant creation failed: ${error}` })
    }
  }

  async update() {
    const accessGrant = await this.loadAccessGrant()
    if (isNil(accessGrant)) {
      return this.response.status(404).json({ message: "Access grant not found." })
    }

    const policy = this.buildPolicy(accessGrant)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update access grants on this dataset." })
    }

    const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
    try {
      const updatedAccessGrant = await UpdateService.perform(
        accessGrant,
        permittedAttributes,
        this.currentUser
      )
      return this.response.status(200).json({ accessGrant: updatedAccessGrant })
    } catch (error) {
      return this.response.status(422).json({ message: `Access grant update failed: ${error}` })
    }
  }

  private async buildAccessGrant(): Promise<AccessGrant> {
    return AccessGrant.build(this.request.body)
  }

  private async loadAccessGrant(): Promise<AccessGrant | null> {
    return AccessGrant.findByPk(this.params.accessGrantId)
  }

  private buildPolicy(accessGrant: AccessGrant) {
    return new AccessGrantsPolicy(this.currentUser, accessGrant)
  }
}
```

and the policy

```ts
export class AccessGrantsPolicy extends BasePolicy<AccessGrant> {
  create(): boolean {
    // some code that might returns true
    return false
  }

  update(): boolean {
    // some code that might returns true
    return false
  }

  destroy(): boolean {
    // some code that might returns true
    return false
  }

  permittedAttributes(): Path[] {
    return ["supportId", "grantLevel", "accessType", "isProjectDescriptionRequired"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["datasetId", ...this.permittedAttributes()]
  }
}
```
