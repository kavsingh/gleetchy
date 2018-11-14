import produce from 'immer'
import { Reducer } from 'redux'

import { audioContexts } from '~/state/defaultNodes'
import { AudioNodeState } from '~/types'

import { AudioContextsAction } from './types'

export type AudioContextsState = Array<AudioNodeState<{}>>

const defaultState: AudioContextsState = [...audioContexts]

const audioContextsReducer: Reducer<AudioContextsState, AudioContextsAction> = (
  state = defaultState,
  action,
): AudioContextsState => {
  switch (action.type) {
    case 'AUDIO_CONTEXT_UPDATE_LABEL':
      return produce<AudioContextsState>(state, draftState => {
        const existingIdx = draftState.findIndex(
          ({ id }) => id === action.payload.id,
        )

        if (existingIdx !== -1) {
          draftState[existingIdx].label = action.payload.label
        }
      })
    default:
      return state
  }
}

export default audioContextsReducer
