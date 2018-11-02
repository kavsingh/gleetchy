import { MAIN_OUT_ID } from '~/constants/audio'
import COLORS from '~/constants/color'
import * as delay from '~/nodes/audioEffects/delay'
import * as reverb from '~/nodes/audioEffects/reverb'
import * as loop from '~/nodes/instruments/loop'
import { GAudioNode } from '~/types'

export type AudioContextNode = GAudioNode<{}>

export type AudioInstrumentNode = GAudioNode<typeof loop.nodeProps>

export type AudioEffectNode =
  | GAudioNode<typeof delay.nodeProps>
  | GAudioNode<typeof reverb.nodeProps>

export const audioContexts: AudioContextNode[] = [
  {
    color: COLORS[0],
    id: MAIN_OUT_ID,
    label: 'Main',
    props: {},
    type: 'AUDIO_CONTEXT',
  },
]

export const instruments: AudioInstrumentNode[] = [
  {
    color: COLORS[1],
    id: 'looper-default0',
    label: 'L0',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
  {
    color: COLORS[2],
    id: 'looper-default1',
    label: 'L1',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
]

export const audioEffects: AudioEffectNode[] = [
  {
    color: COLORS[3],
    id: 'delay-default0',
    label: 'D0',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    color: COLORS[4],
    id: '​​​​delay-default1',
    label: 'D1',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    color: COLORS[5],
    id: '​​​​​reverb-default0',
    label: 'R0',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
  {
    color: COLORS[6],
    id: 'reverb-default1',
    label: 'R1',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
]
