import { FX_REVERB, FX_DELAY, INS_LOOP } from './nodeTypes'

export default {
  [FX_REVERB]: Object.freeze({
    wetDryRatio: 0.5,
  }),
  [FX_DELAY]: Object.freeze({
    delayTime: 0.6,
    wetDryRatio: 0.5,
  }),
  [INS_LOOP]: Object.freeze({
    fileName: '',
    fileType: '',
    audioBuffer: undefined,
    gain: 0.5,
    loopStart: 0,
    loopEnd: 1,
    playbackRate: 1,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
  }),
}
