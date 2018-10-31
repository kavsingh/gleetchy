import { filter, path, pipe } from 'ramda'

export const getWindow = () =>
  typeof window !== 'undefined' ? window : undefined

export const hasWindow = () => !!getWindow()

export const hasWindowWith = (propPaths: string[][] = []) => {
  const win = getWindow()

  if (!win) {
    return false
  }

  const windowHas = pipe(
    (propPath: string[]) => path(propPath, win),
    (o: any) => typeof o !== 'undefined',
  )

  return propPaths.every(windowHas)
}

export const isSupportedEvent = (eventName: string) => {
  const name = eventName.startsWith('on') ? eventName : `on${eventName}`

  return (
    hasWindowWith([['document', 'documentElement']]) &&
    (name in document! || name in document!.documentElement!)
  )
}

export const filterSupportedEvents = filter(isSupportedEvent)
