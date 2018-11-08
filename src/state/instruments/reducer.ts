import produce from 'immer'
import { Reducer } from 'redux'

import COLORS from '~/constants/color'
import {
  nodeProps as loopNodeProps,
  nodeType as loopNodeType,
} from '~/nodes/instruments/loop'
import { AudioFileDecodeCompleteAction } from '~/state/audioFiles/types'
import { AudioInstrumentNode, instruments } from '~/state/defaultNodes'
import { prefixedId } from '~/util/id'

interface InstrumentsById {
  [key: string]: AudioInstrumentNode
}

export interface InstrumentsState {
  orderedIdAndType: Array<{ id: string; type: string }>
  byId: InstrumentsById
}

import { InstrumentsAction } from './types'

const defaultState = {
  byId: instruments.reduce((acc: InstrumentsById, instrument) => {
    acc[instrument.id] = instrument
    return acc
  }, {}),
  orderedIdAndType: instruments.map(({ id, type }) => ({ id, type })),
}

const addInstrument = (state: InstrumentsState, { type }: { type: string }) => {
  switch (type) {
    case loopNodeType:
      const newLoop = {
        color: COLORS[state.orderedIdAndType.length % COLORS.length],
        id: prefixedId('loop'),
        label: 'LX',
        props: { ...loopNodeProps },
        type: loopNodeType,
      }

      return produce<InstrumentsState>(state, draftState => {
        draftState.orderedIdAndType.push({ id: newLoop.id, type: newLoop.type })
        draftState.byId[newLoop.id] = newLoop
      })
    default:
      return state
  }
}

const removeInstrument = (state: InstrumentsState, { id }: { id: string }) =>
  produce<InstrumentsState>(state, draftState => {
    const orderedIndex = draftState.orderedIdAndType.findIndex(
      instrument => id === instrument.id,
    )

    if (orderedIndex !== -1) {
      draftState.orderedIdAndType.splice(orderedIndex, 1)
    }

    if (draftState.byId[id]) {
      delete draftState.byId[id]
    }
  })

const updateInstrumentProps = (
  state: InstrumentsState,
  { id, props }: { id: string; props: object },
) =>
  produce<InstrumentsState>(state, draftState => {
    const existing = draftState.byId[id]

    if (!existing) {
      return
    }

    Object.assign(existing.props, props)
  })

const updateInstrumentLabel = (
  state: InstrumentsState,
  { id, label }: { id: string; label: string },
) =>
  produce<InstrumentsState>(state, draftState => {
    const existing = draftState.byId[id]

    if (existing) {
      existing.label = label
    }
  })

const instrumentsReducer: Reducer<
  InstrumentsState,
  InstrumentsAction | AudioFileDecodeCompleteAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'INSTRUMENT_ADD':
      return addInstrument(state, action.payload)
    case 'INSTRUMENT_REMOVE':
      return removeInstrument(state, action.payload)
    case 'INSTRUMENT_UPDATE_PROPS':
      return updateInstrumentProps(state, action.payload)
    case 'AUDIO_FILE_DECODE_COMPLETE':
      return updateInstrumentProps(state, {
        id: action.payload.id,
        props: action.payload.file,
      })
    case 'INSTRUMENT_UPDATE_LABEL':
      return updateInstrumentLabel(state, action.payload)
    default:
      return state
  }
}

export default instrumentsReducer
