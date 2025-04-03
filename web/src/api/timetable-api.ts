import http from "@/api/http-client"

export const timetableApi = {
  async upload(file: File): Promise<void> {
    const formData = new FormData()
    formData.append("file", file)

    await http.post("/api/timetable/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}

export default timetableApi
