import { pipe, path, filter, __ } from 'ramda'

export const getWindow = () =>
  typeof window !== 'undefined' ? window : undefined

export const hasWindow = () => !!getWindow()

export const hasWindowWith = (propPaths = []) => {
  const win = getWindow()

  if (!win) return false

  const windowHas = pipe(
    path(__, win),
    o => typeof o !== 'undefined',
  )

  return propPaths.every(windowHas)
}

export const isSupportedEvent = eventName => {
  const name = eventName.startsWith('on') ? eventName : `on${eventName}`

  return (
    hasWindowWith([['document', 'documentElement']]) &&
    (name in document || name in document.documentElement)
  )
}

export const filterSupportedEvents = filter(isSupportedEvent)
