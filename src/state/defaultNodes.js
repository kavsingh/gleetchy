import COLORS from '~/constants/color'
import { MAIN_OUT_ID } from '~/constants/audio'
import * as loop from '~/nodes/instruments/loop'
import * as delay from '~/nodes/audioEffects/delay'
import * as reverb from '~/nodes/audioEffects/reverb'

export const audioContexts = [
  {
    type: 'AUDIO_CONTEXT',
    id: MAIN_OUT_ID,
    label: 'Main',
    color: COLORS[0],
    props: {},
  },
]

export const instruments = [
  {
    type: loop.nodeType,
    id: 'loop0',
    label: 'L0',
    color: COLORS[1],
    props: { ...loop.nodeProps },
  },
  {
    type: loop.nodeType,
    id: 'loop1',
    label: 'L1',
    color: COLORS[2],
    props: { ...loop.nodeProps },
  },
]

export const audioEffects = [
  {
    type: delay.nodeType,
    id: 'delay0',
    label: 'D0',
    color: COLORS[3],
    props: { ...delay.nodeProps },
  },
  {
    type: delay.nodeType,
    id: 'delay1',
    label: 'D1',
    color: COLORS[4],
    props: { ...delay.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: 'reverb0',
    label: 'R0',
    color: COLORS[5],
    props: { ...reverb.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: 'reverb1',
    label: 'R1',
    color: COLORS[6],
    props: { ...reverb.nodeProps },
  },
]
