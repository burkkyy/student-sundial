import http from "@/api/http-client"

// Must match Course in api/src/models/course.ts
export type Course = {
  id: number
  name: string
  description: string
  start_on: string
  end_on: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null

  // associations
  //  blocks: Block[] | null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type CourseWhereOptions = {}

export type CourseQueryOptions = {
  where?: CourseWhereOptions
  page?: number
  perPage?: number
}

export const coursesApi = {
  async list(params: CourseQueryOptions = {}): Promise<{
    courses: Course[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/courses", {
      params,
    })
    return data
  },
  async get(courseId: number): Promise<{ course: Course }> {
    const { data } = await http.get(`/api/courses/${courseId}`)
    return data
  },
  async create(attributes: Partial<Course>): Promise<{ course: Course }> {
    const { data } = await http.post("/api/courses", attributes)
    return data
  },
  async update(courseId: number, attributes: Partial<Course>): Promise<{ course: Course }> {
    const { data } = await http.patch(`/api/courses/${courseId}`, attributes)
    return data
  },
  async delete(courseId: number): Promise<void> {
    const { data } = await http.delete(`/api/courses/${courseId}`)
    return data
  },
}

export default coursesApi
