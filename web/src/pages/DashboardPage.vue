<template>
  <v-row>
    <v-col
      cols="12"
      md="9"
    >
      <TabCard :tabs="tabs">
        <v-tabs-window-item :value="0">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-h5">Courses</h2>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                text="Add Course"
                @click="openNewCourseDialog"
              />
            </div>
            <v-row>
              <v-col
                v-for="course in courses"
                :key="course.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="h-100">
                  <v-card-title>{{ course.name }}</v-card-title>
                  <v-card-text>
                    <p class="text-subtitle-2">Start: {{ course.startDate }}</p>
                    <p class="text-subtitle-2">End: {{ course.endDate }}</p>
                    <p class="text-body-2">{{ course.description }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary">View Details</v-btn>
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
              <div class="d-flex align-center">
                <v-checkbox
                  v-model="hidePassedEvents"
                  label="Hide passed events"
                  hide-details
                  class="mr-4"
                ></v-checkbox>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="openNewEventDialog"
                >
                  Add Event
                </v-btn>
              </div>
            </div>
            <v-timeline
              align="start"
              density="compact"
            >
              <v-timeline-item
                v-for="event in filteredEvents"
                :key="event.id"
                :dot-color="event.color"
                :icon="event.icon"
                size="small"
                side="end"
                fill-dot
              >
                <template #opposite>
                  <div class="text-caption text-medium-emphasis">{{ event.dueDate }}</div>
                </template>
                <div class="d-flex justify-space-between align-center">
                  <div class="flex-grow-1">
                    <h3 class="text-subtitle-1">{{ event.title }}</h3>
                    <p class="text-caption">[eventid: {{ event.id }}]</p>
                    <p class="text-caption">{{ event.course }}</p>
                    <p class="text-caption">DUE: {{ event.dueDate }}</p>
                  </div>
                  <div class="d-flex align-center ml-4">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      class="mr-2"
                      @click="openEditEventDialog(event)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteEvent(event)"
                    ></v-btn>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-tabs-window-item>
      </TabCard>
    </v-col>

    <v-col
      cols="12"
      md="3"
    >
      <SimpleCard
        title="Upcoming Deadlines"
        color="error"
      >
        <v-list>
          <v-list-item
            v-for="event in sortedUpcomingEvents.slice(0, 5)"
            :key="event.id"
          >
            <template #prepend>
              <v-icon :color="event.color">mdi-calendar-alert</v-icon>
            </template>
            <v-list-item-title>{{ event.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ event.course }} - {{ event.dueDate }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </SimpleCard>

      <SimpleCard
        title="Course Statistics"
        color="success"
        class="mt-4"
      >
        <v-list>
          <v-list-item>
            <v-list-item-title>Upcoming Events</v-list-item-title>
            <v-list-item-subtitle>{{ upcomingEventsCount }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </SimpleCard>
    </v-col>
  </v-row>
  <v-btn
    color="primary"
    :to="`/dashboardU`"
    >StuView</v-btn
  >

  <!-- Add New Course Dialog -->
  <v-dialog
    v-model="newCourseDialog"
    max-width="600px"
  >
    <v-card>
      <v-card-title>Add New Course</v-card-title>
      <v-card-text>
        <v-form ref="courseForm">
          <v-text-field
            v-model="newCourse.name"
            label="Course Name"
            required
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="newCourse.description"
            label="Course Description"
            required
            class="mb-3"
          ></v-textarea>
          <v-text-field
            v-model="newCourse.startDate"
            label="Start Date"
            type="date"
            required
            class="mb-3"
          ></v-text-field>
          <v-text-field
            v-model="newCourse.endDate"
            label="End Date"
            type="date"
            required
            class="mb-3"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          @click="newCourseDialog = false"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          @click="saveNewCourse"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- New Course Event Dialog -->
  <v-dialog
    v-model="newEventDialog"
    max-width="600px"
  >
    <v-card>
      <v-card-title>{{ editingEvent ? "Edit Event" : "Add New Event" }}</v-card-title>
      <v-card-text>
        <v-form
          ref="eventForm"
          @submit.prevent="saveNewEvent"
        >
          <v-text-field
            v-model="newEvent.title"
            label="Event Title"
            :rules="[(v) => !!v || 'Title is required']"
            required
            class="mb-3"
          ></v-text-field>
          <v-select
            v-model="newEvent.courseId"
            :items="courses"
            item-title="name"
            item-value="id"
            label="Course"
            :rules="[(v) => v > 0 || 'Course is required']"
            required
            class="mb-3"
          ></v-select>
          <v-text-field
            v-model="newEvent.dueDate"
            label="Due Date"
            type="date"
            :rules="[(v) => !!v || 'Due date is required']"
            required
            class="mb-3"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          @click="newEventDialog = false"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          @click="saveNewEvent"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Manage Specific Course Events Dialog -->
  <v-dialog
    v-model="courseEventsDialog"
    max-width="800px"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ selectedCourse?.name }} - Course Events</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openNewEventDialog"
        >
          Add Event
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="hidePassedEvents"
          label="Hide passed events"
          hide-details
          class="mb-4"
        ></v-checkbox>
        <v-list>
          <v-list-item
            v-for="event in filteredCourseEvents"
            :key="event.id"
          >
            <template #prepend>
              <v-icon :color="event.color">{{ event.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ event.title }}</v-list-item-title>
            <v-list-item-subtitle>Due: {{ event.dueDate }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                class="mr-2"
                @click="openEditEventDialog(event)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="deleteEvent(event)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="courseEventsDialog = false"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-btn
    text="Press Me"
    @click="foo"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import SimpleCard from "@/components/common/SimpleCard.vue"
import TabCard from "@/components/common/TabCard.vue"

import { useAuth0 } from "@auth0/auth0-vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import googleCalendarApi from "@/api/google-calendar-api"

const { currentUser } = useCurrentUser()
const { user } = useAuth0()

async function foo() {
  await googleCalendarApi.listEvents()
}

useBreadcrumbs("Dashboard [PROF]", [])

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
    endDate: "2025-04-15",
  },
  {
    id: 2,
    name: "CSCI 201",
    instructor: "prof. johnson",
    description: "Advanced data structures and algorithms",
    startDate: "2025-01-01",
    endDate: "2025-04-15",
  },
])

const upcomingEvents = ref([
  {
    id: 1,
    title: "Assignment 1 Due",
    course: "CSCI 101",
    dueDate: "2025-03-25",
    color: "green",
    icon: "mdi-check-bold",
    courseId: 1,
  },
  {
    id: 2,
    title: "Midterm Exam",
    course: "CSCI 201",
    dueDate: "2025-04-30",
    color: "primary",
    icon: "mdi-clock-time-nine",
    courseId: 2,
  },
  {
    id: 3,
    title: "Midterm Exam",
    course: "CSCI 101",
    dueDate: "2025-04-24",
    color: "primary",
    icon: "mdi-clock-time-nine",
    courseId: 1,
  },
])

// dialog controls
const newCourseDialog = ref(false)
const newEventDialog = ref(false)
const courseForm = ref(null)
const eventForm = ref(null)

const newCourse = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
})

const newEvent = ref({
  title: "",
  courseId: 0,
  dueDate: "",
})

const editingEvent = ref<Event | null>(null)

// refs for course events management
const courseEventsDialog = ref(false)
const selectedCourse = ref<Course | null>(null)

// refs for hiding passed events
const hidePassedEvents = ref(false)

// 'computed' property for sorted course events
const courseEvents = computed(() => {
  if (!selectedCourse.value) return []
  return upcomingEvents.value
    .filter((event) => event.courseId === selectedCourse.value?.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
})

// computed property to handle filtering. 'passed events'
const filteredCourseEvents = computed(() => {
  if (!selectedCourse.value) return []

  let events = upcomingEvents.value
    .filter((event) => event.courseId === selectedCourse.value?.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  if (hidePassedEvents.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    events = events.filter((event) => new Date(event.dueDate) >= today)
  }

  return events
})

// Add new computed property for filtered events in the main timeline
const filteredEvents = computed(() => {
  let events = [...upcomingEvents.value].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  if (hidePassedEvents.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    events = events.filter((event) => new Date(event.dueDate) >= today)
  }

  return events
})

// methods
const openNewCourseDialog = () => {
  newCourse.value = { name: "", description: "", startDate: "", endDate: "" }
  newCourseDialog.value = true
}

const openNewEventDialog = () => {
  editingEvent.value = null
  newEvent.value = {
    title: "",
    courseId: selectedCourse.value?.id || 0,
    dueDate: "",
  }
  newEventDialog.value = true
}

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
  courseId: number
}

// update the openEventDialog function
const openEventDialog = (course: Course) => {
  selectedCourse.value = course
  courseEventsDialog.value = true
}

// opens the edit dialog for an existing event
const openEditEventDialog = (event: Event) => {
  editingEvent.value = event
  newEvent.value = {
    title: event.title,
    courseId: event.courseId,
    dueDate: event.dueDate,
  }
  newEventDialog.value = true
}

// deletes an event after confirmation
const deleteEvent = async (event: Event) => {
  if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
    // implement event deletion
    console.log("Delete event:", event)
    upcomingEvents.value = upcomingEvents.value.filter((e) => e.id !== event.id)
  }
}

const saveNewCourse = async () => {
  const form = courseForm.value as any
  const { valid } = await form.validate()

  if (!valid) {
    return
  }

  // create new course with a unique ID
  const newId = Math.max(...courses.value.map((c) => c.id), 0) + 1
  const newCourseData = {
    id: newId,
    name: newCourse.value.name,
    description: newCourse.value.description,
    startDate: newCourse.value.startDate,
    endDate: newCourse.value.endDate,
    instructor: "Current User", // placeholder for actual user data
  }

  // adds the new course to the courses array
  courses.value.push(newCourseData)

  // reset form and close dialog
  newCourse.value = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  }
  newCourseDialog.value = false
}

// saves a new event or update an existing one
const saveNewEvent = async () => {
  const form = eventForm.value as any
  const { valid } = await form.validate()

  if (!valid) {
    return
  }

  const eventDate = new Date(newEvent.value.dueDate)
  const isPassed = isEventPassed(newEvent.value.dueDate)
  const eventColor = isPassed ? "green" : "primary"
  const eventIcon = isPassed ? "mdi-check-bold" : "mdi-clock-time-nine"

  if (editingEvent.value) {
    // update existing event
    const index = upcomingEvents.value.findIndex((e) => e.id === editingEvent.value?.id)
    if (index !== -1) {
      const course = courses.value.find((c) => c.id === newEvent.value.courseId)
      upcomingEvents.value[index] = {
        ...editingEvent.value,
        title: newEvent.value.title,
        courseId: newEvent.value.courseId,
        course: course?.name || "",
        dueDate: newEvent.value.dueDate,
        color: eventColor,
        icon: eventIcon,
      }
    }
  } else {
    // create new event
    const course = courses.value.find((c) => c.id === newEvent.value.courseId)
    const newId = Math.max(...upcomingEvents.value.map((e) => e.id), 0) + 1
    upcomingEvents.value.push({
      id: newId,
      title: newEvent.value.title,
      courseId: newEvent.value.courseId,
      course: course?.name || "",
      dueDate: newEvent.value.dueDate,
      color: eventColor,
      icon: eventIcon,
    })
  }
  newEventDialog.value = false
  editingEvent.value = null
}

// computed property for sorted events by due date
/*
-assign course events to sections
-XXupcoming deadlines sidepanel only shows events which have not happened yet
-upcoming deadlines, maybe display how many days away from deadline
-XXcourse event is colour green w/ check-bold when date is <= today
-XXotherwise course event is blue with clock-time-nine 
-XXcourse statistics -> upcoming events will only count those events which have not passed yet
-XXmanage events button under each course should show all events belonging to that courseid, also allow prof to edit/delete events there.
-somehow show professors all upcoming sectionblocks, provide way to cancel the lectures.
-calendar for students, showing all course events? 
-XXstudent must be able to 'add courses' via pdf upload. 
-XXstudent must be able to 'export' schedule to google calendar.
-XXcourse events tab, checkbox to hide/show passed events
*/
const sortedUpcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // set today

  return [...upcomingEvents.value]
    .filter((event) => new Date(event.dueDate) >= today)
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
})

// computed property for upcoming events count
const upcomingEventsCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return upcomingEvents.value.filter((event) => new Date(event.dueDate) >= today).length
})

const isEventPassed = (date: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(date) < today
}
</script>
