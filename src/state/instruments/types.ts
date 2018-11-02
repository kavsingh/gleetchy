import { ActionWithPayload } from '~/types'

export type InstrumentAddAction = ActionWithPayload<
  'INSTRUMENT_ADD',
  { type: string }
>

export type InstrumentRemoveAction = ActionWithPayload<
  'INSTRUMENT_REMOVE',
  { id: string }
>

export type InstrumentUpdateLabelAction = ActionWithPayload<
  'INSTRUMENT_UPDATE_LABEL',
  { id: string; label: string }
>

export type InstrumentUpdatePropsAction = ActionWithPayload<
  'INSTRUMENT_UPDATE_PROPS',
  { id: string; props: any }
>

export type InstrumentsAction =
  | InstrumentAddAction
  | InstrumentRemoveAction
  | InstrumentUpdateLabelAction
  | InstrumentUpdatePropsAction
