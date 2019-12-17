import { curry } from 'ramda'

/**
 * Removes items from passed in array
 * NOTE: MUTATES PASSED IN OBJECT. Useful in immer produce
 */
export const mutWithout: {
  <T, A>(keys: T[], arr: (A | T)[]): void
  <T, A>(keys: T[]): (arr: (A | T)[]) => void
} = curry((items: unknown[], arr: unknown[]) => {
  // TODO: remove all instances
  items.forEach(item => {
    if (arr.includes(item)) arr.splice(arr.indexOf(item), 1)
  })
})
