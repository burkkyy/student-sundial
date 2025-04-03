import { readFileSync } from "fs"
import { getTimetableFromPdf } from "@/lib/pdf-parser"

async function testTimetablePdfParser() {
  const pdf = readFileSync("tests/resources/001_timetable.pdf")

  const data = await getTimetableFromPdf(pdf)

  if (data.courses.length != 6) {
    throw "parse course should contain 6 courses"
  }
}

function exampleTestPass() {}

function exampleTestFail() {
  throw "useless test"
}

async function runTest(testFunc: () => void | Promise<void>) {
  try {
    await testFunc()
    console.log(`${testFunc.name}... [PASS]`)
  } catch (error) {
    console.error(`${testFunc.name}... [FAIL]:`, error)
  }
}

;(async () => {
  // just add the test function here
  const tests = [exampleTestFail, exampleTestPass, testTimetablePdfParser]

  for (const test of tests) {
    await runTest(test)
  }
})()
