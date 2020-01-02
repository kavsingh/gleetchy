import { curry, equals, without, __ } from 'ramda'

const origIfEqual = <T>(next: T[], orig: T[]) =>
  equals(next, orig) ? orig : next

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableWithout: {
  <T>(items: unknown[], arr: T[]): T[]
  (items: unknown[]): <T>(arr: T[]) => T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((items: any[], arr: any[]) => origIfEqual(without(items, arr), arr))

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableFilter: {
  <T>(predicate: (item: T) => boolean, arr: T[]): T[]
  (predicate: (item: unknown) => boolean): <T>(arr: T[]) => T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((predicate: (item: any) => boolean, arr: any[]) =>
  origIfEqual(arr.filter(predicate), arr),
)

/**
 * Returns new array if items are modified, otherwise
 * returns original array
 */
export const stableAppendUnique: {
  <A, T>(items: T[], arr: A[]): (A | T)[]
  <T>(items: T[]): <A>(arr: A[]) => (A | T)[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((items: any[], arr: any[]) =>
  origIfEqual(without(items, arr).concat(items), arr),
)
