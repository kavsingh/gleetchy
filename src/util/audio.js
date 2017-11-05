import {
  curry,
  propEq,
  sortBy,
  prop,
  startsWith,
  propSatisfies,
  equals,
  tryCatch,
  F,
} from 'ramda'

const typeSatisfies = pred => tryCatch(propSatisfies(pred, 'type'), F)

export const isEffect = typeSatisfies(startsWith('AUDIO_EFFECT_'))
export const isInstrument = typeSatisfies(startsWith('INSTRUMENT_'))
export const isMainOut = typeSatisfies(equals('AUDIO_CONTEXT'))

export const sortByType = sortBy(prop('type'))

export const isSameConnection = curry(
  (connection1, connection2) =>
    connection1.from === connection2.from && connection1.to === connection2.to,
)

export const getConnectionsFor = curry((id, connections) =>
  connections.filter(({ from, to }) => from === id || to === id),
)

export const hasDownstreamConnectionTo = curry((toId, connections, fromId) => {
  if (!connections.length) return false

  const checkDownstreamConnection = innerFromId => {
    const connectionsFromId = connections.filter(propEq('from', innerFromId))

    if (!connectionsFromId.length) return false
    if (connectionsFromId.some(propEq('to', toId))) return true

    return connectionsFromId.reduce(
      (accum, connection) => accum || checkDownstreamConnection(connection.to),
      false,
    )
  }

  return checkDownstreamConnection(fromId)
})
