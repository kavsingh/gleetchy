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
    id: '0c9c1ada-f7ff-47e5-9e1a-45900b578450​​​​​',
    label: 'L0',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
  {
    color: COLORS[2],
    id: '​​​​​fa2321d8-210d-41a0-ae51-5b2d251f37c2​​​​​',
    label: 'L1',
    props: { ...loop.nodeProps },
    type: loop.nodeType,
  },
]

export const audioEffects: AudioEffectNode[] = [
  {
    color: COLORS[3],
    id: '​​​​​6ca6d5f7-5fe0-4658-a6e9-5884203a724a​​​​​',
    label: 'D0',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    color: COLORS[4],
    id: '​​​​​6f2758bd-290f-43c4-b8dd-e962419c1697​​​​​',
    label: 'D1',
    props: { ...delay.nodeProps },
    type: delay.nodeType,
  },
  {
    color: COLORS[5],
    id: '​​​​​0046409d-dbaa-4b92-ae37-889b21b7b4ca​​​​​',
    label: 'R0',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
  {
    color: COLORS[6],
    id: '​​​​​1971f171-48d6-4618-89b4-899416367681​​​​​',
    label: 'R1',
    props: { ...reverb.nodeProps },
    type: reverb.nodeType,
  },
]
