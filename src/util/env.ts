import { path, pipe, split, uniq, __ } from 'ramda'

import { isNotNil } from './object'

export const requireWindowWith = (propPaths: string[] = []) => {
  const WINDOW = typeof window !== 'undefined' ? window : undefined

  if (!WINDOW) {
    return undefined
  }

  const windowHas = pipe(
    split('.'),
    path(__, WINDOW),
    isNotNil,
  )

  return propPaths.every(windowHas) ? WINDOW : undefined
}

const asEventName = (name: string) =>
  name.startsWith('on') ? name.slice(2) : name

const isSupportedEvent = (name: string) => {
  const asHandlerName = name.startsWith('on') ? name : `on${name}`
  const WINDOW = requireWindowWith(['document.documentElement'])

  return WINDOW
    ? asHandlerName in WINDOW.document ||
        asHandlerName in WINDOW.document.documentElement
    : false
}

export const filterSupportedEvents = (eventNames: string[]) =>
  uniq(
    eventNames.reduce((acc: string[], name) => {
      if (isSupportedEvent(name)) acc.push(asEventName(name))
      return acc
    }, []),
  )
