import { propEq } from 'ramda'
import COLORS from '../../constants/color'
import nodeProps from '../../constants/nodeProps'
import { FX_DELAY, FX_REVERB } from '../../constants/nodeTypes'
import {
  removeNodeFromState,
  updateNodePropsInState,
  updateNodeLabelInState,
} from '../nodeReducerUtil'
import { fx } from '../defaultNodes'
import {
  FX_ADD,
  FX_REMOVE,
  FX_UPDATE_PROPS,
  FX_UPDATE_LABEL,
} from './actionTypes'

const defaultState = [...fx]

const addFx = (state, { type }) => {
  switch (type) {
    case FX_DELAY: {
      const delayNodes = state.filter(propEq('type', FX_DELAY))

      return [
        ...state,
        {
          type: FX_DELAY,
          id: `delay${delayNodes.length}`,
          label: `D${delayNodes.length}`,
          color: COLORS[state.length % COLORS.length],
          props: { ...nodeProps[FX_DELAY] },
        },
      ]
    }
    case FX_REVERB: {
      const reverbNodes = state.filter(propEq('type', FX_REVERB))

      return [
        ...state,
        {
          type: FX_REVERB,
          id: `reverb${reverbNodes.length}`,
          label: `R${reverbNodes.length}`,
          color: COLORS[state.length % COLORS.length],
          props: { ...nodeProps[FX_REVERB] },
        },
      ]
    }
    default:
      return state
  }
}

const fxReducer = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case FX_ADD:
      return addFx(state, payload)
    case FX_REMOVE:
      return removeNodeFromState(state, payload)
    case FX_UPDATE_PROPS:
      return updateNodePropsInState(state, payload)
    case FX_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default fxReducer
