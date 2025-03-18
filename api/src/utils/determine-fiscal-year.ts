import { DateTime } from "luxon"

export function determineFiscalYear() {
  const today = DateTime.local() // Get the current date
  const fiscalYearStartMonth = 4 // Fiscal year starts in April

  // If today's month is April or later, the fiscal year started this calendar year
  if (today.month >= fiscalYearStartMonth) {
    return today.year // Fiscal year is the current year
  } else {
    // If the month is before April, the fiscal year started last calendar year
    return today.year - 1
  }
}

export default determineFiscalYear
