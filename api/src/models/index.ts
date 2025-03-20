import db from "@/db/db-client"

// Import Models
import User from "@/models/user"
import UserRole from "@/models/user-role"

// Export the models here so they can be imported
export { User, UserRole }

// Special db instance will all models loaded
export default db
