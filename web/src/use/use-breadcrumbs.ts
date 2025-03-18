import { isUndefined } from "lodash"
import { reactive, toRefs } from "vue"
import { RouteLocationRaw } from "vue-router"

export type Breadcrumb = {
  title: string
  disabled?: boolean
  exact?: boolean
  to: RouteLocationRaw
}

export const BASE_CRUMB = {
  title: "Vault Home",
  disabled: false,
  to: {
    name: "DashboardPage",
  },
}
export const ADMIN_CRUMB = {
  title: "Administration Dashboard",
  disabled: false,
  to: { name: "administration/DashboardPage" },
  exact: true,
}

// Global state for breadcrumbs
const state = reactive<{
  breadcrumbs: Breadcrumb[]
  title: string | null
}>({
  breadcrumbs: [],
  title: null,
})

export function useBreadcrumbs(title?: string, breadcrumbs?: Breadcrumb[]) {
  if (!isUndefined(title)) {
    state.title = title
  }
  if (!isUndefined(breadcrumbs)) state.breadcrumbs = breadcrumbs

  return {
    ...toRefs(state),
    update: useBreadcrumbs,
  }
}

export default useBreadcrumbs
