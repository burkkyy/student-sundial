import fs from "fs";
import pdfParser from "../src/utils/parsepdf"
(async () => {
	const pdf = fs.readFileSync("CourseSchedule.PDF");
	const parser = new pdfParser(pdf);
	parser.parse();
	const courses = await parser.getCourses()
	if (courses.length != 4) {
		throw ("parse course should contain 4 courses");
	}
})();
