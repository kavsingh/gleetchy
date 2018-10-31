import { audioContexts } from '~/state/defaultNodes'
import { updateNodeLabelInState } from '~/state/nodeReducerUtil'
import { GAudioNode } from '~/types'

import { AUDIO_CONTEXT_UPDATE_LABEL } from './actionTypes'

export type AudioContextsState = Array<GAudioNode<{}>>

const defaultState: AudioContextsState = [...audioContexts]

const audioContextsReducer = (
  state = defaultState,
  { payload = {}, type }: { payload?: any; type?: string } = {},
): AudioContextsState => {
  switch (type) {
    case AUDIO_CONTEXT_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default audioContextsReducer
