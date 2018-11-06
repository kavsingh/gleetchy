import { nodeType as loopNodeType } from '~/nodes/instruments/loop'

import {
  InstrumentAddAction,
  InstrumentRemoveAction,
  InstrumentUpdateLabelAction,
  InstrumentUpdatePropsAction,
} from './types'

export const addInstrumentAction = (type: string): InstrumentAddAction => ({
  payload: { type },
  type: 'INSTRUMENT_ADD',
})

export const addLoopAction = () => addInstrumentAction(loopNodeType)

export const removeInstrumentAction = (id: string): InstrumentRemoveAction => ({
  payload: { id },
  type: 'INSTRUMENT_REMOVE',
})

export const updateInstrumentPropsAction = (
  id: string,
  props: any,
): InstrumentUpdatePropsAction => ({
  payload: { id, props },
  type: 'INSTRUMENT_UPDATE_PROPS',
})

export const updateInstrumentLabelAction = (
  id: string,
  label: string,
): InstrumentUpdateLabelAction => ({
  payload: { id, label },
  type: 'INSTRUMENT_UPDATE_LABEL',
})
