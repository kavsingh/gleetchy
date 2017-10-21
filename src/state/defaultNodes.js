import COLORS from '../constants/color'
import { MAIN_OUT_ID } from '../constants/audio'
import {
  AUDIO_CTX,
  INS_LOOP,
  FX_DELAY,
  FX_REVERB,
} from '../constants/nodeTypes'
import nodeProps from '../constants/nodeProps'

export const audioContexts = [
  {
    type: AUDIO_CTX,
    id: MAIN_OUT_ID,
    label: 'Main',
    color: COLORS[0],
    props: {},
  },
]

export const instruments = [
  {
    type: INS_LOOP,
    id: 'loop0',
    label: 'L0',
    color: COLORS[1],
    props: { ...nodeProps[INS_LOOP] },
  },
  {
    type: INS_LOOP,
    id: 'loop1',
    label: 'L1',
    color: COLORS[2],
    props: { ...nodeProps[INS_LOOP] },
  },
]

export const fx = [
  {
    type: FX_DELAY,
    id: 'delay0',
    label: 'D0',
    color: COLORS[3],
    props: { ...nodeProps[FX_DELAY] },
  },
  {
    type: FX_DELAY,
    id: 'delay1',
    label: 'D1',
    color: COLORS[4],
    props: { ...nodeProps[FX_DELAY] },
  },
  {
    type: FX_REVERB,
    id: 'reverb0',
    label: 'R0',
    color: COLORS[5],
    props: { ...nodeProps[FX_REVERB] },
  },
  {
    type: FX_REVERB,
    id: 'reverb1',
    label: 'R1',
    color: COLORS[6],
    props: { ...nodeProps[FX_REVERB] },
  },
]
