import { curry, equals, without, __ } from 'ramda'

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableWithout: {
  <T>(items: unknown[], arr: T[]): T[]
  (items: unknown[]): <T>(arr: T[]) => T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((items: any[], arr: any[]) => {
  const next = without(items, arr)

  return equals(next, arr) ? arr : next
})

export const stableAppendUnique: {
  <A, T>(items: T[], arr: A[]): (A | T)[]
  <T>(items: T[]): <A>(arr: A[]) => (A | T)[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((items: any[], arr: any[]) => {
  const next = without(items, arr).concat(items)

  return equals(next, arr) ? arr : next
})
