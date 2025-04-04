/**
 * Everything in here sucks
 */

export function makeR8DateString(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-08:00`
}

const monthMap: Record<string, string> = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
}

export function convertDateTime(dateStr: string, timeStr: string): string {
  const [day, monthAbbr] = dateStr.split("-")

  const month = monthMap[monthAbbr.toUpperCase()]
  if (!month) throw new Error(`Invalid month abbreviation: ${monthAbbr}`)

  const formattedDate = `2025-${month}-${day.padStart(2, "0")}`
  const formattedTime = timeStr.padStart(5, "0") + ":00"

  return `${formattedDate} ${formattedTime}`
}

function getNumberFromDay(day: string) {
  if (day === "Mo") {
    return 1
  } else if (day === "Tu") {
    return 2
  } else if (day === "We") {
    return 3
  } else if (day === "Th") {
    return 4
  } else if (day === "Fr") {
    return 5
  } else if (day === "Sa") {
    return 6
  } else if (day === "Su") {
    return 7
  } else {
    throw new Error(`unkown day: ${day}`)
  }
}

export function magicGetDateFromDay(datetime: string, day: string) {
  const dayNumber = getNumberFromDay(day)
  const date = new Date(datetime)

  date.setDate(date.getDate() + ((dayNumber + 7 - date.getDay()) % 7))
  return date
}

export function magigMakeEventEndString(startDate: string, endDate: string) {
  console.log("MAGIC: ", startDate, endDate)
  const start = new Date(startDate)
  const end = new Date(endDate)

  const year = start.getUTCFullYear()
  const month = String(start.getUTCMonth() + 1).padStart(2, "0")
  const day = String(start.getUTCDate()).padStart(2, "0")
  const hours = String(end.getUTCHours()).padStart(2, "0")
  const minutes = String(end.getUTCMinutes()).padStart(2, "0")
  const seconds = String(end.getUTCSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-08:00`
}

export function getTimePart(datetime: string) {
  const date = new Date(datetime)

  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")

  return `${hours}${minutes}${seconds}Z`
}

export function getDatePart(datetime: string) {
  const date = new Date(datetime)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")

  return `${year}${month}${day}T`
}

export function magicDatetimeMaker(startAt: string, endAt: string): string {
  const datePart = getDatePart(startAt)
  const timePart = getTimePart(endAt)
  return `${datePart}${timePart}`
}
