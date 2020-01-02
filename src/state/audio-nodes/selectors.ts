import { createSelector } from 'reselect'

import { AudioNodeMeta } from '~/types'
import { MAIN_OUT_ID } from '~/constants/audio'
import { hasConnectionTo, isInstrument, isAudioEffect } from '~/lib/audio'
import { ApplicationState } from '~/state/configure-store'
import { connectionsSelector } from '~/state/connections/selectors'

const audioNodesStateSelector = (state: ApplicationState) => state.audioNodes

export const audioNodesSelector = createSelector(
  audioNodesStateSelector,
  state => state.byId,
)

// TODO: Better naming

export const immutableNodesMetaSelector = createSelector(
  audioNodesStateSelector,
  state => state.orderedMeta,
)

export const immutableInstrumentsMetaSelector = createSelector(
  immutableNodesMetaSelector,
  meta => meta.filter(isInstrument),
)

export const immutableAudioEffectsMetaSelector = createSelector(
  immutableNodesMetaSelector,
  meta => meta.filter(isAudioEffect),
)

export const mainOutNodeSelector = createSelector(
  audioNodesSelector,
  nodes => nodes[MAIN_OUT_ID],
)

export const mainOutMetaSelector = createSelector(
  mainOutNodeSelector,
  ({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
)

export const activeAudioNodeIdsSelector = createSelector(
  immutableNodesMetaSelector,
  connectionsSelector,
  mainOutNodeSelector,
  (meta, connections, mainOut) => {
    const connectedToMain = hasConnectionTo(connections, mainOut.id)

    return meta.map(({ id }) => id).filter(connectedToMain)
  },
)

export const connectableSourcesSelector = createSelector(
  audioNodesSelector,
  immutableInstrumentsMetaSelector,
  immutableAudioEffectsMetaSelector,
  (nodes, instruments, effects) => [
    ...instruments.map(meta => ({ ...meta, label: nodes[meta.id].label })),
    ...effects.map(meta => ({ ...meta, label: nodes[meta.id].label })),
  ],
)

export const connectableTargetsSelector = createSelector(
  audioNodesSelector,
  immutableAudioEffectsMetaSelector,
  mainOutMetaSelector,
  (nodes, effects, out) => [
    ...effects.map(meta => ({ ...meta, label: nodes[meta.id].label })),
    out,
  ],
)
