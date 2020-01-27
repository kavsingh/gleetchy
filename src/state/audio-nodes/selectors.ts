import { createSelector } from 'reselect'

import { AudioNodeMeta } from '~/types'
import { MAIN_OUT_ID } from '~/constants/audio'
import { hasConnectionTo, isInstrument, isAudioEffect } from '~/lib/audio'
import { ApplicationState } from '~/state/configure-store'
import { connectionsSelector } from '~/state/connections/selectors'

import { createValueEqSelector } from '../lib/selector'

const audioNodesStateSelector = (state: ApplicationState) => state.audioNodes

export const audioNodesSelector = createSelector(
  audioNodesStateSelector,
  state => state.byId,
)

// TODO: Better naming

export const nodesIdentifierMetaSelector = createSelector(
  audioNodesStateSelector,
  state => state.orderedIndentifierMeta,
)

export const instrumentsIdentifierMetaSelector = createValueEqSelector(
  nodesIdentifierMetaSelector,
  meta => meta.filter(isInstrument),
)

export const audioEffectsIdentifierMetaSelector = createValueEqSelector(
  nodesIdentifierMetaSelector,
  meta => meta.filter(isAudioEffect),
)

export const mainOutNodeSelector = createSelector(
  audioNodesSelector,
  nodes => nodes[MAIN_OUT_ID],
)

export const mainOutMetaSelector = createValueEqSelector(
  mainOutNodeSelector,
  ({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
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
    ...instruments.map(meta => ({ ...meta, label: nodes[meta.id].label })),
    ...effects.map(meta => ({ ...meta, label: nodes[meta.id].label })),
  ],
)

export const connectableTargetsSelector = createValueEqSelector(
  audioNodesSelector,
  audioEffectsIdentifierMetaSelector,
  mainOutMetaSelector,
  (nodes, effects, out): AudioNodeMeta[] => [
    ...effects.map(meta => ({ ...meta, label: nodes[meta.id].label })),
    out,
  ],
)
