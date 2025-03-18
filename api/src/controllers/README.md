# Controllers

These files map api routes to models, policies, services, and serializers.
See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions

e.g.

```typescript
router.route("/api/users").post(UsersController.create)
```

maps the `/api/users` POST endpoint to the `UsersController#create` instance method.

Controllers are advantageous because they provide a suite of helper methods to access various request methods. .e.g. `currentUser`, or `params`. They also provide a location to perform policy checks.

Controllers should implement the BaseController, and provide instance methods.
The `BaseController` provides the magic that lets those methods map to an appropriate route.

## Namespacing

If you need an action that syncs a user with an external directory, a POST route `/api/users/:userId/directory-sync` is the best way to avoid future conflicts and refactors. To implement this you need to "namespace/modularize" the controller. Generally speaking, it is more flexible to keep all routes as CRUD actions, and nest controllers as needed, than it is to add custom routes to a given controller.

e.g. `Users.DirectorySyncController.create` is preferred to `UsersController#directorySync`. Once you start using non-CRUD actions, your controllers will quickly expand beyond human readability and comprehension. Opting to use PascalCase for namespaces as that is the best way to avoid conflicts with local variables.

This is how you would create a namespaced controller:

```bash
api/
|-- src/
|   |-- controllers/
|       |-- users/
|           |-- directory-sync-controller.ts
|       |-- index.ts
|       |-- users-controller.ts
```

```typescript
// api/src/controllers/users/users-controller.ts
import { User } from "@/models"
import BaseController from "@/base-controller"

export class UsersController extends BaseController<User> {
  static async create() {
    // Perform user creation
    // Perform policy check
    // Call appropriate service
    // Perform serialization if needed
    // Return response
  }
}
```

```typescript
// api/src/controllers/users/directory-sync-controller.ts
import { User } from "@/models"
import BaseController from "@/base-controller"

export class DirectorySyncController extends BaseController<User> {
  static async create() {
    // Perform user lookup
    // Perform policy check
    // Call appropriate service
    // Perform serialization if needed
    // Return response
  }
}
```

```typescript
// api/src/controllers/users/index.ts
export { DirectorySyncController } from "./directory-sync-controller"
```

```typescript
// api/src/controllers/index.ts
import * as Users from "./users"

import { UsersController } from "./users-controller"

export { Users, UsersController }
```

```typescript
// api/src/routes.ts
import { Router } from "express"

import { Users } from "@/controllers"

const router = Router()

router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:userId")
  .get(UsersController.show)
  .put(UsersController.update)
  .delete(UsersController.destroy)

router.route("/api/users/:userId/directory-sync").post(Users.DirectorySyncController.create)
```
