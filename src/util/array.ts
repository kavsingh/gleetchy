import { curry, without, contains, __ } from 'ramda'

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableWithout: {
  <T, A>(keys: T[], arr: (A | T)[]): T[]
  <T, A>(keys: T[]): (arr: (A | T)[]) => T[]
} = curry((items: unknown[], arr: unknown[]) =>
  items.some(contains(__, arr)) ? without(items, arr) : arr,
)
