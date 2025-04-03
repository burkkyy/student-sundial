import { readFileSync } from "fs"
import { getTimetableFromPdf } from "@/lib/pdf-parser"

async function testTimetablePdfParser1() {
  const pdf = readFileSync("tests/resources/001_timetable.pdf")

  const data = await getTimetableFromPdf(pdf)

  if (data.courses.length != 6) {
    throw `parse course should contain 6 courses, got: ${data.courses.length}`
  }

  if (data.courses.at(0).blocks.length !== 2) {
    throw `course 1 should have 2 blocks, got: ${data.courses.at(0).blocks.length}`
  }

  if (data.courses.at(1).blocks.length !== 2) {
    throw `course 2 should have 2 blocks, got: ${data.courses.at(1).blocks.length}`
  }

  if (data.courses.at(2).blocks.length !== 2) {
    throw `course 3 should have 2 blocks, got: ${data.courses.at(2).blocks.length}`
  }

  if (data.courses.at(3).blocks.length !== 2) {
    throw `course 4 should have 2 blocks, got: ${data.courses.at(3).blocks.length}`
  }

  if (data.courses.at(4).blocks.length !== 2) {
    throw `course 5 should have 2 blocks, got: ${data.courses.at(4).blocks.length}`
  }

  if (data.courses.at(5).blocks.length !== 1) {
    throw `course 6 should have 2 blocks, got: ${data.courses.at(5).blocks.length}`
  }
}

async function testTimetablePdfParser2() {
  const pdf = readFileSync("tests/resources/002_timetable.pdf")

  const data = await getTimetableFromPdf(pdf)

  if (data.courses.length != 4) {
    throw `parse course should contain 4 courses, got: ${data.courses.length}`
  }

  if (data.courses.at(0).blocks.length !== 2) {
    throw `course 1 should have 2 blocks, got: ${data.courses.at(0).blocks.length}`
  }

  if (data.courses.at(1).blocks.length !== 2) {
    throw `course 2 should have 2 blocks, got: ${data.courses.at(1).blocks.length}`
  }

  if (data.courses.at(2).blocks.length !== 2) {
    throw `course 3 should have 2 blocks, got: ${data.courses.at(2).blocks.length}`
  }

  if (data.courses.at(3).blocks.length !== 2) {
    throw `course 4 should have 2 blocks, got: ${data.courses.at(3).blocks.length}`
  }
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
  // just add the test functions in here
  const tests = [testTimetablePdfParser1, testTimetablePdfParser2]
  for (const test of tests) {
    await runTest(test)
  }
})()
