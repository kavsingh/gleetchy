import { MAIN_OUT_ID } from '~/constants/audio'
import {
  hasConnectionTo,
  hasInstrumentType,
  hasAudioEffectType,
} from '~/lib/audio'
import { selectConnections } from '~/state/connections/selectors'

import { createValueEqSelector } from '../lib/selector'

import type { AppState } from '~/state/configure-store'
import type { AudioNodeMeta } from '~/types'

export const selectAudioNodes = (state: AppState) => state.audioNodes.byId

// TODO: Better naming
export const selectNodesIdentifierMeta = (state: AppState) =>
  state.audioNodes.orderedIndentifierMeta

export const selectInstrumentsIdentifierMeta = createValueEqSelector(
  selectNodesIdentifierMeta,
  (meta) => meta.filter(hasInstrumentType),
)

export const selectAudioEffectsIdentifierMeta = createValueEqSelector(
  selectNodesIdentifierMeta,
  (meta) => meta.filter(hasAudioEffectType),
)

export const selectMainOutNode = (state: AppState) => {
  const mainOut = state.audioNodes.byId[MAIN_OUT_ID]

  if (!mainOut) throw new Error('Main out not found')

  return mainOut
}

export const selectMainOutMeta = createValueEqSelector(
  selectMainOutNode,
  ({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
)

export const selectActiveAudioNodeIds = createValueEqSelector(
  selectNodesIdentifierMeta,
  selectConnections,
  selectMainOutNode,
  (meta, connections, mainOut) => {
    const connectedToMain = hasConnectionTo(connections, mainOut.id)

    return meta.map(({ id }) => id).filter(connectedToMain)
  },
)

export const selectConnectableSources = createValueEqSelector(
  selectAudioNodes,
  selectInstrumentsIdentifierMeta,
  selectAudioEffectsIdentifierMeta,
  (nodes, instruments, effects): AudioNodeMeta[] => [
    ...instruments.map((meta) => ({
      ...meta,
      label: nodes[meta.id]?.label || '',
    })),
    ...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label || '' })),
  ],
)

export const selectConnectableTargets = createValueEqSelector(
  selectAudioNodes,
  selectAudioEffectsIdentifierMeta,
  selectMainOutMeta,
  (nodes, effects, out): AudioNodeMeta[] => [
    ...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label || '' })),
    out,
  ],
)
