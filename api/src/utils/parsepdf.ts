import PDFParser from "pdf2json";

export type Course = {
  name: string
}

export type Delivery = {
  course: Course;
  delivery: string;
}

export type Prof = {
  course: Course
  prof: string
}

export type Section = {
  course: Course
  section: string
}

export type Block = {
  course: Course
  location: string
}

export type Days = {
  block: Block
  days: string
}

export type StartTime = {
  block: Block
  time: string
}

export type EndTime = {
  block: Block
  time: string
}

export type StartDate = {
  block: Block
  date: string
}

export type EndDate = {
  block: Block
  date: string
}

export type Status = {
  block: Block
  status: string
}

export default class PdfParser {
  parser: PDFParser
  Courses: Course[]
  Deliveries: Delivery[]
  Profs: Prof[]
  Sections: Section[]
  Blocks: Block[]
  Locations: Location[]
  Days: Days[]
  StartTimes: StartTime[]
  EndTimes: EndTime[]
  StartDates: StartDate[]
  EndDates: EndDate[]
  Statuses: Status[]

  pdf: Buffer;

  constructor(buffer: Buffer) {
    this.parser = new PDFParser();
    this.pdf = buffer;
    this.Courses = []
    this.Deliveries = []
    this.Profs = []
    this.Sections = []
    this.Blocks = []
    this.Locations = []
    this.Days = []
    this.StartTimes = []
    this.EndTimes = []
    this.StartDates = []
    this.EndDates = []
    this.Statuses = []
  }

  async parse() {
    this.parser.parseBuffer(this.pdf);
    this.parser.on("pdfParser_dataReady", (pdfData) => {
      // course schedule is in the second page
      const vlines = pdfData.Pages[1].VLines;

      // filter duplicate lines, 11 columns should only have 12 vertical lines
      const cleanVlines = [];
      // get x coordinates for left and right vertical lines of each columns(11)
      for (let i = 0; i < vlines.length; i++) {
        // have to search for value because dirty vlines aren't sorted
        if (cleanVlines.indexOf(vlines[i].x) < 0) {
          cleanVlines.push(vlines[i].x);
        }
      }
      // sort the vlines
      cleanVlines.sort(function(a, b) {
        return a - b;
      });

      const words = pdfData.Pages[1].Texts;
      for (let w = 23; w < words.length; w++) {
        const word = words[w];
        const wordx = word.x;
        const wordText = word.R[0].T


        // course name column
        if (0.603 == wordx) {
          this.Courses.push({ name: wordText });
        }
        if (
          // section column
          3.9779999999999998 == wordx
        ) {
          this.Sections.push({ course: this.Courses[this.Courses.length - 1], section: wordText })
        }
        if (
          // location column
          6.228 == wordx
        ) {
          this.Blocks.push({ course: this.Courses[this.Courses.length - 1], location: wordText })
        }
        if (
          // days column
          cleanVlines[3] <= wordx + 0.072 &&
          cleanVlines[4] > wordx + 0.075
        ) {
          this.Days.push({ block: this.Blocks[this.Blocks.length - 1], days: wordText })
        }
        if (
          // start column
          17.477 == wordx
        ) {
          this.StartTimes.push({ block: this.Blocks[this.Blocks.length - 1], time: wordText })
        }
        if (
          // end time column
          19.277 == wordx
        ) {
          this.StartTimes.push({ block: this.Blocks[this.Blocks.length - 1], time: wordText })
        }
        if (
          // start date column
          21.078 == wordx
        ) {
          this.StartDates.push({ block: this.Blocks[this.Blocks.length - 1], date: wordText })
        }
        if (
          // end date column
          23.777 == wordx
        ) {
          this.EndDates.push({ block: this.Blocks[this.Blocks.length - 1], date: wordText })
        }
        if (
          // status column
          26.478 == wordx
        ) {
          this.Statuses.push({ block: this.Blocks[this.Blocks.length - 1], status: wordText })
        }
        if (
          // prof column
          30.978 == wordx
        ) {
          this.Profs.push({ course: this.Courses[this.Courses.length - 1], prof: wordText })
        }
        if (
          // delivery move column
          42.227 == wordx
        ) {
          this.Deliveries.push({ course: this.Courses[this.Courses.length - 1], delivery: wordText })
        }
      }

    });

    this.parser.on("pdfParser_dataError", (errData) => {
      throw errData
    });
  }

  async getCourses() { return this.Courses }
  async getDeliveries() { return this.Deliveries }
  async getProfs() { return this.Profs }
  async getSections() { return this.Sections }
  async getBlocks() { return this.Blocks }
  async getLocations() { return this.Locations }
  async getDays() { return this.Days }
  async getStartTimes() { return this.StartTimes }
  async getEndTimes() { return this.EndTimes }
  async getStartDates() { return this.StartDates }
  async getEndDates() { return this.EndDates }
  async getStatuses() { return this.Statuses }
}
