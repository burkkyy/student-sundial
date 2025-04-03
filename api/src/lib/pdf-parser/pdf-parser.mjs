import PDFParser from "pdf2json"
import { readFileSync, writeFileSync } from "fs"

export class PdfParser {
  courses = []
  parser
  pdf
  currentCourse = undefined
  currentBlock = undefined

  constructor(buffer) {
    this.parser = new PDFParser()
    this.pdf = buffer
  }

  addCourse(name) {
    console.log("ADDING COURSE: ", name)

    if (this.currentCourse !== undefined) {
      if (this.currentBlock !== undefined) {
        this.currentCourse.blocks.push(this.currentBlock)
        this.currentBlock = undefined
      }
      this.courses.push(this.currentCourse)
    }

    const course = {
      name,
      section: "",
      blocks: [],
      status: "",
      profs: [],
      deliveries: [],
    }

    this.currentCourse = course
  }

  addSection(section) {
    if (this.currentCourse === undefined) {
      throw new Error("Adding a section without a course")
    }
    this.currentCourse.section = section
  }

  addBlock() {
    if (this.currentCourse === undefined) {
      throw new Error("Adding a block without a course")
    }

    if (this.currentBlock !== undefined) {
      this.currentCourse.blocks.push(this.currentBlock)
    }

    const block = {
      location: "",
      days: "",
      startTime: [],
      endTime: [],
      startDate: [],
      endDate: [],
    }
    this.currentBlock = block
    console.log("ADDING A BLOCK TO COURSE: ", this.currentCourse.name)
  }

  addLocation(location) {
    if (this.currentBlock === undefined) {
      console.warn("There is no block to add data to!")
      //this.currentCourse.locations.push({ location })
      return
    }

    this.currentBlock.location = location
  }

  addDays(days) {
    this.addBlock()

    this.currentBlock.days = days
  }

  addStartTime(time) {
    if (this.currentBlock === undefined) {
      console.warn("There is no block to add data to!")
      //this.currentCourse.startTimes.push({ time })
      return
    }

    this.currentBlock.startTime = time
  }

  addEndTime(time) {
    if (this.currentBlock === undefined) {
      console.warn("There is no block to add data to!")
      //this.currentCourse.startTimes.push({ time })
      return
    }

    this.currentBlock.endTime = time
  }

  addStartDate(date) {
    if (this.currentBlock === undefined) {
      console.warn("There is no block to add data to!")
      //this.currentCourse.startDates.push({ date })
      return
    }

    this.currentBlock.startDate = date
  }

  addEndDate(date) {
    if (this.currentBlock === undefined) {
      console.warn("There is no block to add data to!")
      //this.currentCourse.endDates.push({ date })
      return
    }

    this.currentBlock.endDate = date
  }

  handlePdfWord(wordx, wordText, cleanVlines) {
    switch (true) {
      case wordx === 0.603:
        this.addCourse(wordText)
        break
      case wordx == 3.9779999999999998:
        this.addSection(wordText)
        break
      case wordx === 6.228:
        this.addLocation(wordText)
        break
      case cleanVlines[3] <= wordx + 0.072 && cleanVlines[4] > wordx + 0.075:
        this.addDays(wordText)
        break
      case wordx === 17.477:
        this.addStartTime(wordText)
        break
      case wordx === 19.277:
        this.addEndTime(wordText)
        break
      case wordx === 21.078:
        this.addStartDate(wordText)
        break
      case wordx === 23.777:
        this.addEndDate(wordText)
        break
      case wordx === 26.478:
        this.currentCourse.status = wordText
        break
      case wordx === 30.978:
        this.currentCourse.profs.push({ prof: wordText })
        break
      case wordx === 42.227:
        this.currentCourse.deliveries.push({ delivery: wordText })
        break
      default:
        break
    }
  }

  async parse() {
    return new Promise((resolve, reject) => {
      this.parser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const vlines = pdfData.Pages[1].VLines
          const cleanVlines = []
          for (let i = 0; i < vlines.length; i++) {
            if (!cleanVlines.includes(vlines[i].x)) {
              cleanVlines.push(vlines[i].x)
            }
          }
          cleanVlines.sort((a, b) => a - b)

          const words = pdfData.Pages[1].Texts

          for (let w = 23; w < words.length; w++) {
            const word = words[w]
            const wordx = word.x
            const wordText = decodeURIComponent(word.R[0].T)
            this.handlePdfWord(wordx, wordText, cleanVlines)
          }

          if (this.currentCourse !== undefined) {
            if (this.currentBlock !== undefined) {
              this.currentCourse.blocks.push(this.currentBlock)
              this.currentBlock = undefined
            }
            this.courses.push(this.currentCourse)
          }

          resolve(this.courses)
        } catch (err) {
          reject(err)
        }
      })

      this.parser.on("pdfParser_dataError", reject)

      this.parser.parseBuffer(this.pdf)
    })
  }

  async getCourses() {
    return this.courses
  }
}

const args = process.argv.slice(2)
const inputPdfPath = args[0]
const outputJsonPath = args[1]

if (!inputPdfPath) {
  console.error("Error: Please provide the input PDF file path.")
  process.exit(1)
}

if (!outputJsonPath) {
  console.error("Error: Please provide the output PDF file path.")
  process.exit(1)
}

;(async () => {
  try {
    const pdf = readFileSync(inputPdfPath)
    const parser = new PdfParser(pdf)
    await parser.parse()

    const courses = await parser.getCourses()

    if (courses.length === 0) {
      throw new Error("No courses found in the parsed PDF.")
    }

    writeFileSync(outputJsonPath, JSON.stringify({ courses }, null, 2))

    //console.log(`Parsing successful. Output written to ${outputJsonPath}`)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
})()
