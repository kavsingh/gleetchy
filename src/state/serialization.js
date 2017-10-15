import { anyPass, curry, pick, pipe, prop } from 'ramda'

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
  prop('gleetchy'),
  pick(['nodes', 'connections']),
  state => JSON.stringify({ gleetchy: unsetUnserializable(state) }, null, 2),
)

export const deserialize = stateString => JSON.parse(stateString)
