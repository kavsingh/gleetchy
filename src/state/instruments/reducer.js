import { uuid } from '~/util/uuid'
import COLORS from '~/constants/color'
import {
  nodeType as loopNodeType,
  nodeProps as loopNodeProps,
} from '~/nodes/instruments/loop'
import {
  removeNodeFromState,
  updateNodePropsInState,
  updateNodeLabelInState,
} from '~/state/nodeReducerUtil'
import { instruments } from '~/state/defaultNodes'
import { AUDIO_FILE_DECODE_COMPLETE } from '~/state/audioFiles/actionTypes'

import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
  INSTRUMENT_UPDATE_LABEL,
} from './actionTypes'

const defaultState = [...instruments]

const addInstrument = (state, { type }) => {
  switch (type) {
    case loopNodeType:
      return [
        ...state,
        {
          type: loopNodeType,
          id: uuid(),
          label: 'LX',
          color: COLORS[state.length % COLORS.length],
          props: { ...loopNodeProps },
        },
      ]
    default:
      return state
  }
}

const instrumentsReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case INSTRUMENT_ADD:
      return addInstrument(state, payload)
    case INSTRUMENT_REMOVE:
      return removeNodeFromState(state, payload)
    case INSTRUMENT_UPDATE_PROPS:
      return updateNodePropsInState(state, payload)
    case AUDIO_FILE_DECODE_COMPLETE:
      return updateNodePropsInState(state, {
        id: payload.id,
        props: payload.file,
      })
    case INSTRUMENT_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default instrumentsReducer
