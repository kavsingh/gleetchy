import { anyPass, pick, pipe } from 'ramda'

import type { ApplicationState } from '~/state/configure-store'

const isObjectLike = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object'

// eslint-disable-next-line @typescript-eslint/ban-types
const isInstanceOf = (ctor: Function) => (instance: unknown) =>
  instance instanceof ctor

const isUnserializable = anyPass([
  isInstanceOf(AudioBuffer),
  isInstanceOf(ArrayBuffer),
  isInstanceOf(Error),
])

const unsetUnserializable = (struct: unknown): unknown => {
  if (isUnserializable(struct)) return undefined

  if (Array.isArray(struct)) {
    return (struct as unknown[]).map(unsetUnserializable)
  }

  if (isObjectLike(struct)) {
    const copy = { ...struct }

    Object.entries(copy).forEach(([key, value]) => {
      copy[key] = unsetUnserializable(value)
    })

    return copy
  }

  return struct
}

export const serialize: (state: ApplicationState) => string = pipe(
  pick<keyof ApplicationState>(['audioNodes', 'connections', 'audioFiles']),
  (state: Partial<ApplicationState>) =>
    JSON.stringify(unsetUnserializable(state)),
)

export const deserialize = (stateString: string) => JSON.parse(stateString)
