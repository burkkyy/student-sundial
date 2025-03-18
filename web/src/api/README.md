# API

> Explanation of Naming: _the_ API mapping to the back-end, if there was an api that corresponded to something else, such as auth0, then it would go in a folder named `web/src/auth0-api/`

APIs provide a way to map back-end endpoints to standard create/read/update/delete (CRUD) actions in the front-end. They handle api setup and data transformation. This lets them remain very simple and flexible if data needs to be transformed to match a new format from the backend, before the front-end gets updated to handle the new format.

e.g.

```javascript
// web/src/api/directory-entries-api.ts
import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"

export type DirectoryEntry = {
  id: string
  givenName: string | null
  surname: string | null
  displayName: string | null
  mail: string | null
  userPrincipalName: string | null
  department: string | null
  division: string | null
  branch: string | null
  unit: string | null
  officeLocation: string | null
  ynetId: string | null
  longName: string | null
  title: string | null
  employeeType: string | null
  mailcode: string | null
  accountEnabled: boolean | null
  isExcluded: boolean | null
  isException: boolean | null
  isExceptionOverride: boolean | null
}

export type DirectoryEntryWhereOptions = {
  givenName?: string
  surname?: string
  mail?: string
  userPrincipalName?: string
  department?: string
  division?: string
  branch?: string
  unit?: string
  ynetId?: string
  employeeType?: string
  mailcode?: string
  accountEnabled?: boolean
  isExcluded?: boolean
  isException?: boolean
  isExceptionOverride?: boolean
}

export type DirectoryEntryFiltersOptions = {
  search?: string
}

export const directoryEntriesApi = {
  async list(
    params: {
      where?: DirectoryEntryWhereOptions
      filters?: DirectoryEntryFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    directoryEntries: DirectoryEntry[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/directory-entries", {
      params,
    })
    return data
  },
  async get(directoryEntryId: string): Promise<{
    directoryEntry: DirectoryEntry
    policy: Policy
  }> {
    const { data } = await http.get(`/api/directory-entries/${directoryEntryId}`)
    return data
  },
  async create(attributes: Partial<DirectoryEntry>): Promise<{
    directoryEntry: DirectoryEntry
  }> {
    const { data } = await http.post("/api/directory-entries", attributes)
    return data
  },
  async update(
    directoryEntryId: string,
    attributes: Partial<DirectoryEntry>
  ): Promise<{
    directoryEntry: DirectoryEntry
  }> {
    const { data } = await http.patch(`/api/directory-entries/${directoryEntryId}`, attributes)
    return data
  },
  async delete(directoryEntryId: string): Promise<void> {
    const { data } = await http.delete(`/api/directory-entries/${directoryEntryId}`)
    return data
  },
}

export default directoryEntriesApi
```

The above code handles all access to the /api/directory-entries endpoint, and since we are using axios it strips out the extra "data" attribute that axios wraps around the request.

This gives a single location to update if the backend naming convention changes.
