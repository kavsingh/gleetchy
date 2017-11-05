import eq3Props from '~/nodes/audioEffects/eq3/nodeProps'

export default Object.freeze({
  ...eq3Props,
  fileName: '',
  fileType: '',
  audioBuffer: undefined,
  gain: 0.5,
  loopStart: 0,
  loopEnd: 1,
  playbackRate: 1,
})
