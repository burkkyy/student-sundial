import db from "@/db/db-client"

// Import Models
import User from "@/models/user"
import UserRole from "@/models/user-role"
import Course from "@/models/course"

// Export the models here so they can be imported
export { User, UserRole, Course }

// Special db instance will all models loaded
export default db
