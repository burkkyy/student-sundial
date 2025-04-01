<template>
  <v-row>
    <v-col cols="12" md="9">
      <TabCard :tabs="tabs">
        <v-tabs-window-item :value="0">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-h5">Courses</h2>
              <div class="d-flex">
                <v-btn
                  color="success"
                  prepend-icon="mdi-export"
                  append-icon="mdi-google-calendar"
                  class="mr-4"
                  @click="exportToGoogleCalendar"
                >
                  Export Calendar
                </v-btn>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-file-upload"
                  @click="openPdfUploadDialog"
                >
                  Upload Timetable
                </v-btn>
              </div>
            </div>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="course in courses" :key="course.id">
                <v-card class="h-100">
                  <v-card-title>{{ course.name }}</v-card-title>
                  <v-card-text>
                    <p class="text-subtitle-2">Start: {{ course.startDate }}</p>
                    <p class="text-subtitle-2">End: {{ course.endDate }}</p>
                    <p class="text-body-2">{{ course.description }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" :to="`/courses/${course.id}`">View Details</v-btn>
                    <v-btn
                      color="secondary"
                      variant="outlined"
                      class="ml-2"
                      @click="openEventDialog(course)"
                    >
                      Manage Events
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
       
        </v-tabs-window-item>

        <v-tabs-window-item :value="1">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-h5">Course Events</h2>
              <v-checkbox
                  v-model="hidePassedEvents"
                  label="Hide passed events"
                  hide-details
                  class="mr-4"
                ></v-checkbox>
            </div>
            <v-timeline align="start" density="compact">
              <v-timeline-item
                v-for="event in filteredEvents"
                :key="event.id"
                :dot-color="event.color"
                :icon="event.icon"
                size="small"
                side="end"               
                fill-dot
              >
                <template v-slot:opposite>
                  <div class="text-caption text-medium-emphasis">{{ event.dueDate }}</div>
                </template>
                <div class="d-flex justify-space-between align-center">
                  <div class="flex-grow-1">
                    <h3 class="text-subtitle-1">{{ event.title }}</h3>
                    <p class="text-caption">{{ event.course }}</p>
                    <p class="text-caption">DUE: {{ event.dueDate }}</p>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-tabs-window-item>
      </TabCard>
    </v-col>

    <v-col cols="12" md="3">
      <SimpleCard title="Upcoming Deadlines" color="error">
        <v-list>
          <v-list-item v-for="event in sortedUpcomingEvents.slice(0, 5)" :key="event.id">
            <template v-slot:prepend>
              <v-icon :color="event.color">mdi-calendar-alert</v-icon>
            </template>
            <v-list-item-title>{{ event.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ event.course }} - {{ event.dueDate }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </SimpleCard>

      <SimpleCard title="Course Statistics" color="success" class="mt-4">
        <v-list>
          <v-list-item>
            <v-list-item-title>Upcoming Events</v-list-item-title>
            <v-list-item-subtitle>{{ upcomingEventsCount }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </SimpleCard>
    </v-col>
  </v-row>
  <v-btn color="primary" :to="`/dashboard`">ProfView</v-btn>

  <!-- PDF Upload Dialog -->
  <v-dialog v-model="pdfUploadDialog" max-width="600px">
    <v-card>
      <v-card-title>Upload Course Schedule</v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-4">Upload your course schedule PDF to automatically add your courses.</p>
        <v-file-input
          v-model="pdfFile"
          accept=".pdf"
          label="Select PDF File"
          prepend-icon="mdi-file-pdf"
          :rules="[v => !!v || 'Please select a PDF file']"
          @change="handleFileChange"
        ></v-file-input>
        <v-progress-linear
          v-if="isUploading"
          indeterminate
          color="primary"
          class="mt-4"
        ></v-progress-linear>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="closePdfUploadDialog">Cancel</v-btn>
        <v-btn 
          color="primary" 
          @click="uploadPdf"
          :disabled="!pdfFile || isUploading"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Course Events View Dialog -->
  <v-dialog v-model="courseEventsDialog" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ selectedCourse?.name }} - Course Events</span>
      </v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="hidePassedEvents"
          label="Hide passed events"
          hide-details
          class="mb-4"
        ></v-checkbox>
        <v-list>
          <v-list-item v-for="event in filteredCourseEvents" :key="event.id">
            <template v-slot:prepend>
              <v-icon :color="event.color">{{ event.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ event.title }}</v-list-item-title>
            <v-list-item-subtitle>Due: {{ event.dueDate }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="courseEventsDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import SimpleCard from "@/components/common/SimpleCard.vue"
import TabCard from "@/components/common/TabCard.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Dashboard [STUDENT]", [])

const tabs = ref([
  { value: 0, title: "My Courses", icon: "mdi-human-male-board-poll" },
  { value: 1, title: "Course Events", icon: "mdi-calendar" },
])

// placeholder data - replace w/ actual data from backend
const courses = ref([
  
  {
    id: 1,
    name: "CSCI 101",
    instructor: "dr. dick",
    description: "Basic concepts of programming and algorithms",
    startDate: "2025-01-01",
    endDate: "2025-04-15"
  },
  {
    id: 2,
    name: "CSCI 201",
    instructor: "prof. johnson",
    description: "Advanced data structures and algorithms",
    startDate: "2025-01-01",
    endDate: "2025-04-15"
  }
    
])

const upcomingEvents = ref([
  {
    id: 1,
    title: "Assignment 1 Due",
    course: "CSCI 101",
    dueDate: "2025-03-25",
    color: "green",
    icon: "mdi-check-bold",
    courseId: 1
  },
  {
    id: 2,
    title: "Midterm Exam",
    course: "CSCI 201",
    dueDate: "2025-04-30",
    color: "primary",
    icon: "mdi-clock-time-nine",
    courseId: 2
  },
  {
    id: 3,
    title: "Midterm Exam",
    course: "CSCI 101",
    dueDate: "2025-04-24",
    color: "primary",
    icon: "mdi-clock-time-nine",
    courseId: 1
  }
])

interface Course {
  id: number
  name: string
  instructor: string
  description: string
  startDate: string
  endDate: string
}

interface Event {
  id: number
  title: string
  course: string
  dueDate: string
  color: string
  icon: string
  courseId: number
}

//  refs for course events management
const courseEventsDialog = ref(false)
const selectedCourse = ref<Course | null>(null)
const hidePassedEvents = ref(false)

// computed property for course-specific events
const courseEvents = computed(() => {
  if (!selectedCourse.value) return []
  return upcomingEvents.value
    .filter(event => event.courseId === selectedCourse.value?.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
})

// computed property to handle filtering
const filteredCourseEvents = computed(() => {
  if (!selectedCourse.value) return []
  
  let events = upcomingEvents.value
    .filter(event => event.courseId === selectedCourse.value?.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  if (hidePassedEvents.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    events = events.filter(event => new Date(event.dueDate) >= today)
  }

  return events
})

// computed property for filtered events in the main timeline
const filteredEvents = computed(() => {
  let events = [...upcomingEvents.value].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  if (hidePassedEvents.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    events = events.filter(event => new Date(event.dueDate) >= today)
  }

  return events
})

//  openEventDialog function
const openEventDialog = (course: Course) => {
  selectedCourse.value = course
  courseEventsDialog.value = true
}

// sortedUpcomingEvents computed property to only show future events
const sortedUpcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate date comparison
  
  return [...upcomingEvents.value]
    .filter(event => new Date(event.dueDate) >= today)
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
})

// computed property for upcoming events count
const upcomingEventsCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return upcomingEvents.value.filter(event => new Date(event.dueDate) >= today).length
})

// refs for PDF upload
const pdfUploadDialog = ref(false)
const pdfFile = ref<File | null>(null)
const isUploading = ref(false)

//  methods for PDF upload
const openPdfUploadDialog = () => {
  pdfFile.value = null
  pdfUploadDialog.value = true
}

const closePdfUploadDialog = () => {
  pdfFile.value = null
  isUploading.value = false
  pdfUploadDialog.value = false
}

const handleFileChange = (file: File | null) => {
  
}

const uploadPdf = async () => {
  if (!pdfFile.value) return

  isUploading.value = true
  try {
    //placeholder for the actual implementation
    
    
    
    // placeholder parsed courses
    const parsedCourses = [
      {
        id: 3,
        name: "CSCI 301",
        instructor: "mr. peter",
        description: "Software Engineering",
        startDate: "2025-01-01",
        endDate: "2025-04-15"
      },
      {
        id: 4,
        name: "CSCI 401",
        instructor: "prof. file",
        description: "Linear Algebra",
        startDate: "2025-01-01",
        endDate: "2025-04-15"
      }
    ]

    // Add parsed courses to the courses list
    courses.value.push(...parsedCourses)
    
    alert('Courses successfully added from PDF!')
    closePdfUploadDialog()
  } catch (error) {
    console.error('Error uploading PDF:', error)
    alert('Error uploading PDF. Please try again.')
  } finally {
    isUploading.value = false
  }
}

// Add new method for Google Calendar export
const exportToGoogleCalendar = () => {

}
</script>


