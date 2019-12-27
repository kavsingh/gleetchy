import { curry, without, contains, __ } from 'ramda'

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableWithout: {
  <T>(items: unknown[], arr: T[]): T[]
  (items: unknown[]): <T>(arr: T[]) => T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((items: any[], arr: any[]) =>
  items.some(contains(__, arr)) ? without(items, arr) : arr,
)
