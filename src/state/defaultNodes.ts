import { MAIN_OUT_ID } from '~/constants/audio'
import * as delay from '~/nodes/audioEffects/delay'
import * as reverb from '~/nodes/audioEffects/reverb'
import * as loop from '~/nodes/instruments/loop'
import { AudioNodeState } from '~/types'

export type AudioContextNode = AudioNodeState<{}>

export type AudioInstrumentNode = AudioNodeState<typeof loop.nodeProps>

export type AudioEffectNode =
  | AudioNodeState<typeof delay.nodeProps>
  | AudioNodeState<typeof reverb.nodeProps>

export const audioContexts: AudioContextNode[] = [
  {
    id: MAIN_OUT_ID,
    label: 'Main',
    props: {},
    type: 'AUDIO_CONTEXT',
  },
]

export const instruments: AudioInstrumentNode[] = [
  {
    id: 'looper-default0',
    label: 'L0',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
  {
    id: 'looper-default1',
    label: 'L1',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
]

export const audioEffects: AudioEffectNode[] = [
  {
    id: 'delay-default0',
    label: 'D0',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    id: '​​​​delay-default1',
    label: 'D1',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    id: '​​​​​reverb-default0',
    label: 'R0',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
  {
    id: 'reverb-default1',
    label: 'R1',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
]
