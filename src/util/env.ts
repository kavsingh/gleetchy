import { path, pipe } from 'ramda'

export const requireWindowWith = (propPaths: string[][] = []) => {
  const WINDOW = typeof window !== 'undefined' ? window : undefined

  if (!WINDOW) {
    return undefined
  }

  const windowHas = pipe(
    (propPath: string[]) => path(propPath, WINDOW),
    (o: unknown) => typeof o !== 'undefined',
  )

  return propPaths.every(windowHas) ? WINDOW : undefined
}

const isSupportedEvent = <T extends string>(eventName: T) => {
  const name = eventName.startsWith('on') ? eventName : `on${eventName}`
  const WINDOW = requireWindowWith([['document', 'documentElement']])

  return WINDOW
    ? name in WINDOW.document || name in WINDOW.document.documentElement
    : false
}

export const filterSupportedEvents = <T extends string = string>(
  eventNames: T[],
) => eventNames.filter(name => isSupportedEvent<T>(name))
