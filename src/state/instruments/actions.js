import { INS_LOOP } from '../../constants/nodeTypes'
import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
  INSTRUMENT_UPDATE_LABEL,
} from './actionTypes'

export const addInstrumentAction = type => ({
  type: INSTRUMENT_ADD,
  payload: { type },
})

export const addLoopAction = () => addInstrumentAction(INS_LOOP)

export const removeInstrumentAction = id => ({
  type: INSTRUMENT_REMOVE,
  payload: { id },
})

export const updateInstrumentPropsAction = (id, props) => ({
  type: INSTRUMENT_UPDATE_PROPS,
  payload: { id, props },
})

export const updateInstrumentLabelAction = (id, label) => ({
  type: INSTRUMENT_UPDATE_LABEL,
  payload: { id, label },
})
