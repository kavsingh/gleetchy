import { curry, propEq, anyPass } from 'ramda'
import { FX_DELAY, FX_REVERB, INS_LOOP } from '../constants/nodeTypes'

const typeEquals = propEq('type')

export const isFx = anyPass([typeEquals(FX_REVERB), typeEquals(FX_DELAY)])
export const isInstrument = anyPass([typeEquals(INS_LOOP)])

export const decodeAudioDataP = curry(
  (audioContext, buffer) =>
    new Promise((resolve, reject) =>
      audioContext.decodeAudioData(buffer, resolve, reject),
    ),
)
