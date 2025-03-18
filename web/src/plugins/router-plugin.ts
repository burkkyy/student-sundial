import { createRouter, createWebHistory } from "vue-router"
import { authGuard } from "@auth0/auth0-vue"

import { APPLICATION_NAME } from "@/config"
import routes from "@/routes"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  document.title = `${APPLICATION_NAME} : ${to.meta.title ? " " + to.meta.title : ""}`

  if (to.meta.requiresAuth === false) return true

  const isAuthenticated = await authGuard(to)
  if (isAuthenticated) return true

  return false
})

export default router
