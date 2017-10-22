import { curry, propEq, anyPass, sortBy, prop } from 'ramda'
import {
  AUDIO_CTX,
  FX_DELAY,
  FX_REVERB,
  INS_LOOP,
} from '../constants/nodeTypes'

const typeEquals = propEq('type')

export const isFx = anyPass([typeEquals(FX_REVERB), typeEquals(FX_DELAY)])
export const isInstrument = anyPass([typeEquals(INS_LOOP)])
export const isMainOut = anyPass([typeEquals(AUDIO_CTX)])

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
      (accum, connection) =>
        accum || checkDownstreamConnection(connection.to.id),
      false,
    )
  }

  return checkDownstreamConnection(fromId)
})
