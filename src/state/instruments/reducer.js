import COLORS from '../../constants/color'
import { INS_LOOP } from '../../constants/nodeTypes'
import nodeProps from '../../constants/nodeProps'
import {
  removeNodeFromState,
  updateNodePropsInState,
  updateNodeLabelInState,
} from '../nodeReducerUtil'
import { instruments } from '../defaultNodes'
import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
  INSTRUMENT_UPDATE_LABEL,
} from './actionTypes'

const defaultState = [...instruments]

const addInstrument = (state, { type }) => {
  switch (type) {
    case INS_LOOP:
      return [
        ...state,
        {
          type: INS_LOOP,
          id: `loop${state.length}`,
          label: `L${state.length}`,
          color: COLORS[state.length % COLORS.length],
          props: { ...nodeProps[INS_LOOP] },
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
    case INSTRUMENT_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default instrumentsReducer
