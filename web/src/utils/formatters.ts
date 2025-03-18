import { isEmpty } from "lodash"
import { DateTime } from "luxon"

export function formatDate(input: string | Date | undefined | null): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toFormat("yyyy-MM-dd")
  if (input) return DateTime.fromJSDate(input).toLocal().toFormat("yyyy-MM-dd")

  return ""
}
export function formatDateTime(input: string | Date | undefined | null): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toFormat("yyyy-MM-dd h:mm a")
  if (input) return DateTime.fromJSDate(input).toLocal().toFormat("yyyy-MM-dd h:mma")

  return ""
}

export function formatRelative(input: string | Date | undefined | null): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toRelative() ?? ""
  if (input) return DateTime.fromJSDate(input).toLocal().toRelative() ?? ""

  return ""
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
