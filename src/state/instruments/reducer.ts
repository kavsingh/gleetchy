import { Reducer } from 'redux'

import COLORS from '~/constants/color'
import {
  nodeProps as loopNodeProps,
  nodeType as loopNodeType,
} from '~/nodes/instruments/loop'
import { AUDIO_FILE_DECODE_COMPLETE } from '~/state/audioFiles/actionTypes'
import { AudioInstrumentNode, instruments } from '~/state/defaultNodes'
import {
  removeNodeFromState,
  updateNodeLabelInState,
  updateNodePropsInState,
} from '~/state/nodeReducerUtil'
import { prefixedId } from '~/util/id'

export type InstrumentsState = AudioInstrumentNode[]

import { InstrumentsAction } from './types'

const defaultState = [...instruments]

const addInstrument = (state: InstrumentsState, { type }: { type: string }) => {
  switch (type) {
    case loopNodeType:
      return [
        ...state,
        {
          color: COLORS[state.length % COLORS.length],
          id: prefixedId('loop'),
          label: 'LX',
          props: { ...loopNodeProps },
          type: loopNodeType,
        },
      ]
    default:
      return state
  }
}

const instrumentsReducer: Reducer<InstrumentsState, InstrumentsAction> = (
  state = defaultState,
  action,
) => {
  switch (action.type) {
    case 'INSTRUMENT_ADD':
      return addInstrument(state, action.payload)
    case 'INSTRUMENT_REMOVE':
      return removeNodeFromState(state, action.payload)
    case 'INSTRUMENT_UPDATE_PROPS':
      return updateNodePropsInState(state, action.payload)
    case AUDIO_FILE_DECODE_COMPLETE:
      return updateNodePropsInState(state, {
        id: action.payload.id,
        props: action.payload.file,
      })
    case 'INSTRUMENT_UPDATE_LABEL':
      return updateNodeLabelInState(state, action.payload)
    default:
      return state
  }
}

export default instrumentsReducer
