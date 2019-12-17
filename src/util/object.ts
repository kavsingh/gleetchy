import { curry, isNil } from 'ramda'

export const isNotNil = <T>(value: T): value is NonNullable<T> => !isNil(value)

/**
 * Deletes keys from passed in object
 * NOTE: MUTATES PASSED IN OBJECT. Useful in immer produce
 */
export const mutOmit: {
  <T extends { [key: string]: unknown }>(keys: (keyof T)[], obj: T): void
  <T extends { [key: string]: unknown }>(keys: (keyof T)[]): (obj: T) => void
} = curry((keys: string[], obj: { [key: string]: unknown }) => {
  keys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) delete obj[key]
  })
})
