import { path, pipe, __ } from 'ramda'

/* eslint-disable no-console */
export const log = console.log.bind(console)

export const warn = console.warn.bind(console)
/* eslint-enable */

export const cancelEvent = event => {
  event.preventDefault()
  event.stopPropagation()
  return false
}

export const docReady = (eventName = 'complete') =>
  new Promise(resolve => {
    document.onreadystatechange = () => {
      if (document.readyState === eventName) resolve()
    }
  })

export const hasWindowWith = (propPaths = []) => {
  if (typeof window === 'undefined') return false

  const windowHas = pipe(path(__, window), o => typeof o !== 'undefined')

  return propPaths.reduce(
    (accum, propPath) => accum && windowHas(propPath),
    true,
  )
}
