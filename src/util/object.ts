import { curry, isNil, has, __, omit } from 'ramda'

export const isNotNil = <T>(value: T): value is NonNullable<T> => !isNil(value)

/**
 * Returns new object if there are items to be removed, otherwise
 * returns original object
 */
export const stableOmit: {
  <T, K extends keyof T>(keys: K[], obj: T): Omit<T, K>
  <T, K extends keyof T>(keys: K[]): (obj: T) => Omit<T, K>
} = curry((keys: string[], obj: { [key: string]: unknown }) =>
  keys.some(has(__, obj)) ? omit(keys, obj) : obj,
)
