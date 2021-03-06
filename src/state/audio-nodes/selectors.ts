import { createSelector } from 'reselect'

import { MAIN_OUT_ID } from '~/constants/audio'
import {
  hasConnectionTo,
  hasInstrumentType,
  hasAudioEffectType,
} from '~/lib/audio'
import { connectionsSelector } from '~/state/connections/selectors'
import type { ApplicationState } from '~/state/configure-store'
import type { AudioNodeMeta } from '~/types'

import { createValueEqSelector } from '../lib/selector'

const audioNodesStateSelector = (state: ApplicationState) => state.audioNodes

export const audioNodesSelector = createSelector(
  audioNodesStateSelector,
  (state) => state.byId,
)

// TODO: Better naming

export const nodesIdentifierMetaSelector = createSelector(
  audioNodesStateSelector,
  (state) => state.orderedIndentifierMeta,
)

export const instrumentsIdentifierMetaSelector = createValueEqSelector(
  nodesIdentifierMetaSelector,
  (meta) => meta.filter(hasInstrumentType),
)

export const audioEffectsIdentifierMetaSelector = createValueEqSelector(
  nodesIdentifierMetaSelector,
  (meta) => meta.filter(hasAudioEffectType),
)

export const mainOutNodeSelector = createSelector(
  audioNodesSelector,
  (nodes) => {
    const mainOut = nodes[MAIN_OUT_ID]

    if (!mainOut) throw new Error('Main out not found')

    return mainOut
  },
)

export const mainOutMetaSelector = createValueEqSelector(
  mainOutNodeSelector,
  (mainOutMeta): AudioNodeMeta => {
    const { id, type, label } = mainOutMeta

    return { id, type, label }
  },
)

export const activeAudioNodeIdsSelector = createValueEqSelector(
  nodesIdentifierMetaSelector,
  connectionsSelector,
  mainOutNodeSelector,
  (meta, connections, mainOut) => {
    const connectedToMain = hasConnectionTo(connections, mainOut.id)

    return meta.map(({ id }) => id).filter(connectedToMain)
  },
)

export const connectableSourcesSelector = createValueEqSelector(
  audioNodesSelector,
  instrumentsIdentifierMetaSelector,
  audioEffectsIdentifierMetaSelector,
  (nodes, instruments, effects): AudioNodeMeta[] => [
    ...instruments.map((meta) => ({
      ...meta,
      label: nodes[meta.id]?.label || '',
    })),
    ...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label || '' })),
  ],
)

export const connectableTargetsSelector = createValueEqSelector(
  audioNodesSelector,
  audioEffectsIdentifierMetaSelector,
  mainOutMetaSelector,
  (nodes, effects, out): AudioNodeMeta[] => [
    ...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label || '' })),
    out,
  ],
)
