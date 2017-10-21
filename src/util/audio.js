import { curry, propEq, pathEq, anyPass, sortBy, prop } from 'ramda'
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

export const decodeAudioDataP = curry(
  (audioContext, buffer) =>
    new Promise((resolve, reject) =>
      audioContext.decodeAudioData(buffer, resolve, reject),
    ),
)

export const isSameConnection = curry(
  (connection1, connection2) =>
    connection1.from.id === connection2.from.id &&
    connection1.to.id === connection2.to.id,
)

export const getConnectionsFor = curry((id, connections) =>
  connections.filter(({ from, to }) => from.id === id || to.id === id),
)

export const hasDownstreamConnectionTo = curry((toId, connections, fromId) => {
  if (!connections.length) return false

  const checkDownstreamConnection = innerFromId => {
    const connectionsFromId = connections.filter(
      pathEq(['from', 'id'], innerFromId),
    )

    if (!connectionsFromId.length) return false
    if (connectionsFromId.some(pathEq(['to', 'id'], toId))) return true

    return connectionsFromId.reduce(
      (accum, connection) =>
        accum || checkDownstreamConnection(connection.to.id),
      false,
    )
  }

  return checkDownstreamConnection(fromId)
})
