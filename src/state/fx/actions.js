import {
  FX_ADD,
  FX_REMOVE,
  FX_UPDATE_PROPS,
  FX_UPDATE_LABEL,
} from './actionTypes'

export const addFxAction = type => ({
  type: FX_ADD,
  payload: { type },
})

export const removeFxAction = id => ({
  type: FX_REMOVE,
  payload: { id },
})

export const updateFxPropsAction = (id, props) => ({
  type: FX_UPDATE_PROPS,
  payload: { id, props },
})

export const updateFxLabelAction = (id, label) => ({
  type: FX_UPDATE_LABEL,
  payload: { id, label },
})
