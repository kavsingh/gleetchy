import { path, curry } from 'ramda'

/* eslint-disable no-console */
export const log = console.log.bind(console)

export const warn = console.warn.bind(console)
/* eslint-enable */

export const cancelEvent = event => {
  event.preventDefault()
  event.stopPropagation()
  return false
}

export const pathString = curry((propPath, obj) =>
  path(propPath.split('.'), obj),
)
