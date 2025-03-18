export type Policy = {
  show: boolean
  create: boolean
  update: boolean
  destroy: boolean
}

// Keep in sync with api/src/controllers/base-controller.ts
export const MAX_PER_PAGE = 1000
