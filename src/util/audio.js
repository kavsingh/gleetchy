import { curry, propEq, anyPass, sortBy, prop, without } from 'ramda'
import { MAIN_OUT_ID } from '../constants/audio'
import { FX_DELAY, FX_REVERB, INS_LOOP } from '../constants/nodeTypes'

const typeEquals = propEq('type')

export const isFx = anyPass([typeEquals(FX_REVERB), typeEquals(FX_DELAY)])
export const isInstrument = anyPass([typeEquals(INS_LOOP)])

export const sortByType = sortBy(prop('type'))

export const decodeAudioDataP = curry(
  (audioContext, buffer) =>
    new Promise((resolve, reject) =>
      audioContext.decodeAudioData(buffer, resolve, reject),
    ),
)

export const isSameConnection = curry(
  (connection1, connection2) =>
    connection1.from === connection2.from && connection1.to === connection2.to,
)

export const getConnectionsFor = curry((id, connections) =>
  connections.filter(({ from, to }) => from === id || to === id),
)
