import produce from 'immer'
import { Reducer } from 'redux'

import { nodeColorPool } from '~/style/color'
import {
  nodeProps as loopNodeProps,
  nodeType as loopNodeType,
} from '~/nodes/instruments/loop'
import { AudioFileDecodeCompleteAction } from '~/state/audioFiles/types'
import { AudioInstrumentNode, instruments } from '~/state/defaultNodes'
import { prefixedId } from '~/util/id'

import { InstrumentsAction } from './types'

import {
  constructDefaultState,
  NodesReducerState,
  removeNodeFromState,
  updateNodeLabelInState,
  updateNodePropsInState,
} from '../nodeReducerUtil'

export type InstrumentsState = NodesReducerState<AudioInstrumentNode>

const defaultState = constructDefaultState<AudioInstrumentNode>(instruments)

const addInstrument = (state: InstrumentsState, { type }: { type: string }) => {
  switch (type) {
    case loopNodeType: {
      const newLoop = {
        color:
          nodeColorPool[state.orderedIdentifiers.length % nodeColorPool.length],
        id: prefixedId('loop'),
        label: 'LX',
        props: { ...loopNodeProps },
        type: loopNodeType,
      }

      return produce<InstrumentsState>(state, draftState => {
        draftState.byId[newLoop.id] = newLoop
        draftState.orderedIdentifiers.push({
          id: newLoop.id,
          type: newLoop.type,
        })
      })
    }
    default:
      return state
  }
}

const instrumentsReducer: Reducer<
  InstrumentsState,
  InstrumentsAction | AudioFileDecodeCompleteAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'INSTRUMENT_ADD':
      return addInstrument(state, action.payload)
    case 'INSTRUMENT_REMOVE':
      return removeNodeFromState<AudioInstrumentNode, InstrumentsState>(
        state,
        action.payload,
      )
    case 'INSTRUMENT_UPDATE_PROPS':
      return updateNodePropsInState<AudioInstrumentNode, InstrumentsState>(
        state,
        action.payload,
      )
    case 'AUDIO_FILE_DECODE_COMPLETE':
      return updateNodePropsInState<AudioInstrumentNode, InstrumentsState>(
        state,
        { id: action.payload.id, props: action.payload.file },
      )
    case 'INSTRUMENT_UPDATE_LABEL':
      return updateNodeLabelInState<AudioInstrumentNode, InstrumentsState>(
        state,
        action.payload,
      )
    default:
      return state
  }
}

export default instrumentsReducer
