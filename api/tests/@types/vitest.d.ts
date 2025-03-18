// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from "vitest"

interface CustomMatchers<R = unknown> {
  toChange: (
    comparator: () => Promise<ComparatorResult>,
    { from, to }: { from: ComparatorResult; to: ComparatorResult }
  ) => Promise<R>
}

declare module "vitest" {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
