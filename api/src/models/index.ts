import db from "@/db/db-client"

// Models
import User from "@/models/user"
import UserRole from "@/models/user-role"

// Add models to this list so they sync with db
db.addModels([User, UserRole])

// Lazy load scopes
User.establishScopes()

// Export the models here so they can be imported
export { User, UserRole }

// Special db instance will all models loaded
export default db
