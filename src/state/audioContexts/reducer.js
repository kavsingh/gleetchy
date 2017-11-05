import { audioContexts } from '~/state/defaultNodes'
import { updateNodeLabelInState } from '~/state/nodeReducerUtil'
import { AUDIO_CONTEXT_UPDATE_LABEL } from './actionTypes'

const defaultState = [...audioContexts]

const audioContextsReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case AUDIO_CONTEXT_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default audioContextsReducer
