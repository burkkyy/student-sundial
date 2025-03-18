import db from "@/db/db-client"

// Models
import ArchiveItemFile from "@/models/archive-item-file"

db.addModels([ArchiveItemFile])

// Lazy load scopes
ArchiveItemFile.establishScopes()

export { ArchiveItemFile }

// Special db instance will all models loaded
export default db
