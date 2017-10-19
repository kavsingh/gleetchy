import { pipe, path, filter, __ } from 'ramda'

export const hasWindow = () => typeof window !== 'undefined'

export const hasWindowWith = (propPaths = []) => {
  if (!hasWindow) return false

  const windowHas = pipe(path(__, window), o => typeof o !== 'undefined')

  return propPaths.reduce(
    (accum, propPath) => accum && windowHas(propPath),
    true,
  )
}

export const isSupportedEvent = eventName => {
  const name = eventName.startsWith('on') ? eventName : `on${eventName}`

  return (
    hasWindowWith([['document', 'documentElement']]) &&
    (name in document || name in document.documentElement)
  )
}

export const filterSupportedEvents = filter(isSupportedEvent)
