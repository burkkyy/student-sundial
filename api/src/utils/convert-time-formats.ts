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
