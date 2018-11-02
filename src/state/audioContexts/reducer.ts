import { Reducer } from 'redux'

import { audioContexts } from '~/state/defaultNodes'
import { updateNodeLabelInState } from '~/state/nodeReducerUtil'
import { GAudioNode } from '~/types'

import { AudioContextsAction } from './types'

export type AudioContextsState = Array<GAudioNode<{}>>

const defaultState: AudioContextsState = [...audioContexts]

const audioContextsReducer: Reducer<AudioContextsState, AudioContextsAction> = (
  state = defaultState,
  action,
): AudioContextsState => {
  switch (action.type) {
    case 'AUDIO_CONTEXT_UPDATE_LABEL':
      return updateNodeLabelInState(state, action.payload)
    default:
      return state
  }
}

export default audioContextsReducer
