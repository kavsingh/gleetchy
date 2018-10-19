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
    id: '0c9c1ada-f7ff-47e5-9e1a-45900b578450​​​​​',
    label: 'L0',
    color: COLORS[1],
    props: { ...loop.nodeProps },
  },
  {
    type: loop.nodeType,
    id: '​​​​​fa2321d8-210d-41a0-ae51-5b2d251f37c2​​​​​',
    label: 'L1',
    color: COLORS[2],
    props: { ...loop.nodeProps },
  },
]

export const audioEffects = [
  {
    type: delay.nodeType,
    id: '​​​​​6ca6d5f7-5fe0-4658-a6e9-5884203a724a​​​​​',
    label: 'D0',
    color: COLORS[3],
    props: { ...delay.nodeProps },
  },
  {
    type: delay.nodeType,
    id: '​​​​​6f2758bd-290f-43c4-b8dd-e962419c1697​​​​​',
    label: 'D1',
    color: COLORS[4],
    props: { ...delay.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: '​​​​​0046409d-dbaa-4b92-ae37-889b21b7b4ca​​​​​',
    label: 'R0',
    color: COLORS[5],
    props: { ...reverb.nodeProps },
  },
  {
    type: reverb.nodeType,
    id: '​​​​​1971f171-48d6-4618-89b4-899416367681​​​​​',
    label: 'R1',
    color: COLORS[6],
    props: { ...reverb.nodeProps },
  },
]
