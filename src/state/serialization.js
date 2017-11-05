import { anyPass, curry, pick, pipe } from 'ramda'

const isInstanceOf = curry((ctor, instance) => instance instanceof ctor)

const isUnserializable = anyPass([
  isInstanceOf(AudioBuffer),
  isInstanceOf(ArrayBuffer),
  isInstanceOf(Error),
])

const unsetUnserializable = struct => {
  if (isUnserializable(struct)) return undefined

  if (Array.isArray(struct)) return struct.map(unsetUnserializable)

  if (typeof struct === 'object') {
    const copy = { ...struct }

    Object.entries(copy).forEach(([key, value]) => {
      copy[key] = unsetUnserializable(value)
    })

    return copy
  }

  return struct
}

export const serialize = pipe(
  pick([
    'audioContexts',
    'instruments',
    'audioEffects',
    'connections',
    'audioFiles',
  ]),
  state => JSON.stringify(unsetUnserializable(state)),
)

export const deserialize = stateString => JSON.parse(stateString)
