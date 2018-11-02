import { anyPass, curry, pick, pipe } from 'ramda'

import { ApplicationState } from '~/state/configureStore'

const isInstanceOf = curry(
  (ctor: any, instance: any) => instance instanceof ctor,
)

const isUnserializable = anyPass([
  isInstanceOf(AudioBuffer),
  isInstanceOf(ArrayBuffer),
  isInstanceOf(Error),
])

const unsetUnserializable = (struct: any): any => {
  if (isUnserializable(struct)) {
    return undefined
  }

  if (Array.isArray(struct)) {
    return struct.map(unsetUnserializable)
  }

  if (typeof struct === 'object') {
    const copy = { ...struct }

    Object.entries(copy).forEach(([key, value]) => {
      copy[key] = unsetUnserializable(value)
    })

    return copy
  }

  return struct
}

export const serialize: (state: ApplicationState) => string = pipe(
  pick<keyof ApplicationState>([
    'audioContexts',
    'instruments',
    'audioEffects',
    'connections',
    'audioFiles',
  ]),
  (state: Partial<ApplicationState>) =>
    JSON.stringify(unsetUnserializable(state)),
)

export const deserialize = (stateString: string) => JSON.parse(stateString)
