import { pipe, filter, __ } from 'ramda'
import { pathString } from './object'

export const hasWindowWith = (propPaths = []) => {
  if (typeof window === 'undefined') return false

  const windowHas = pipe(pathString(__, window), o => typeof o !== 'undefined')

  return propPaths.reduce(
    (accum, propPath) => accum && windowHas(propPath),
    true,
  )
}

export const filterEventNames = filter(
  eventName =>
    hasWindowWith(['document.documentElement']) &&
    (`on${eventName}` in document ||
      `on${eventName}` in document.documentElement),
)
