import { Reducer } from 'redux'

import { audioContexts, AudioContextNode } from '~/state/defaultNodes'
import {
  constructDefaultState,
  NodesReducerState,
  updateNodeLabelInState,
} from '~/state/nodeReducerUtil'

import { AudioContextsAction } from './types'

export type AudioContextsState = NodesReducerState<AudioContextNode>

const defaultState = constructDefaultState<AudioContextNode>(audioContexts)

const audioContextsReducer: Reducer<AudioContextsState, AudioContextsAction> = (
  state = defaultState,
  action,
) => {
  switch (action.type) {
    case 'AUDIO_CONTEXT_UPDATE_LABEL':
      return updateNodeLabelInState<AudioContextNode, AudioContextsState>(
        state,
        action.payload,
      )
    default:
      return state
  }
}

export default audioContextsReducer
