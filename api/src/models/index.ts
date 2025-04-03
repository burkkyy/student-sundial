import db from "@/db/db-client"

// Import Models
import Block from "@/models/block"
import Course from "@/models/course"
import CourseTask from "@/models/course-task"
import Enrollment from "@/models/enrollment"
import Section from "@/models/section"
import SectionBlock from "@/models/section-block"
import Teaching from "@/models/teaching"
import User from "@/models/user"
import UserRole from "@/models/user-role"

// Export the models here so they can be imported
export { User, UserRole, Course, Block, CourseTask, Enrollment, Section, SectionBlock, Teaching }

// Special db instance will all models loaded
export default db
