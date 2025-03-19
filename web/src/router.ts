import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

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
        component: () =>
          import("@/pages/administration/AdministrationPage.vue"),
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
        name: "NotFoundPage",
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/NotFoundPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth === false) return true;
  // TODO: consider whether I should redirect to /sign-in instead of the auth0 login page?
  const isAuthenticated = true; // ignore for now
  if (isAuthenticated) return true;

  // TODO: consider loading user in route guard?
  // check if current user exists
  // attempt to load current user, unless it's already been loaded?
  // if current user does not exist, attempt to create a new user
  // if current user still does exist, throw some kind of error?
  // if meta.requiresRoleAdmin (or whatever) does not match or exceed current user role
  // return false

  return false;
});

export default router;
