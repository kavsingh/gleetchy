import { uuid } from '~/util/uuid'
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
    id: uuid(),
    label: 'L0',
    color: COLORS[1],
    props: { ...loop.nodeProps },
  },
  {
    type: loop.nodeType,
    id: uuid(),
    label: 'L1',
    color: COLORS[2],
    props: { ...loop.nodeProps },
  },
]

export const audioEffects = [
  {
    type: delay.nodeType,
    id: uuid(),
    label: 'D0',
    color: COLORS[3],
    props: { ...delay.nodeProps },
  },
  {
    type: delay.nodeType,
    id: uuid(),
    label: 'D1',
    color: COLORS[4],
    props: { ...delay.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: uuid(),
    label: 'R0',
    color: COLORS[5],
    props: { ...reverb.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: uuid(),
    label: 'R1',
    color: COLORS[6],
    props: { ...reverb.nodeProps },
  },
]
