import { type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        name: "DashboardPage",
        path: "/dashboard",
        component: () => import("@/pages/DashboardPage.vue"),
      },
      {
        name: "DashboardPage U",
        path: "/dashboardU",
        component: () => import("@/pages/DashboardPage U.vue"),
      },
      {
        name: "TimetablePage",
        path: "/timetable",
        component: () => import("@/pages/TimetablePage.vue"),
      },
      {
        name: "Courses",
        path: "/courses",
        component: () => import("@/pages/Courses.vue"),
      },
      {
        name: "SignInPage",
        path: "/sign-in",
        component: () => import("@/pages/SignInPage.vue"),
        meta: { requiresAuth: false },
      },
      {
        name: "StatusPage",
        path: "/status",
        component: () => import("@/pages/StatusPage.vue"),
        meta: { requiresAuth: false },
      },
      {
        name: "administration/AdministrationPage",
        path: "/administration",
        component: () => import("@/pages/administration/AdministrationPage.vue"),
      },
      {
        name: "administration/users/UsersPage",
        path: "/administration/users",
        component: () => import("@/pages/administration/users/UsersPage.vue"),
      },
      {
        name: "administration/users/UserPage",
        path: "/administration/users/:userId",
        component: () => import("@/pages/administration/users/UserPage.vue"),
        props: true,
      },
      {
        path: "/errors/unauthorized",
        name: "UnauthorizedPage",
        component: () => import("@/pages/UnauthorizedPage.vue"),
        meta: { requiresAuth: false },
      },
      {
        name: "NotFoundPage",
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/NotFoundPage.vue"),
      },
    ],
  },
]

export default routes
