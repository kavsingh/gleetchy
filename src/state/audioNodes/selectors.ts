import { createSelector } from 'reselect'

import { AudioNodeMeta } from '~/types'
import { MAIN_OUT_ID } from '~/constants/audio'
import { hasConnectionTo, isInstrument, isAudioEffect } from '~/util/audio'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'

const audioNodesStateSelector = (state: ApplicationState) => state.audioNodes

export const audioNodesSelector = createSelector(
  audioNodesStateSelector,
  state => state.byId,
)

export const orderedAudioNodeIdsSelector = createSelector(
  audioNodesStateSelector,
  state => state.orderedIds,
)

export const orderedAudioNodesMetaSelector = createSelector(
  audioNodesSelector,
  (nodes): AudioNodeMeta[] =>
    Object.values(nodes).map(({ id, type, label }) => ({ id, type, label })),
)

export const mainOutNodeSelector = createSelector(
  audioNodesSelector,
  nodes => nodes[MAIN_OUT_ID],
)

export const mainOutMetaSelector = createSelector(
  mainOutNodeSelector,
  ({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
)

export const orderedInstrumentsMetaSelector = createSelector(
  orderedAudioNodesMetaSelector,
  meta => meta.filter(isInstrument),
)

export const orderedAudioEffectsMetaSelector = createSelector(
  orderedAudioNodesMetaSelector,
  meta => meta.filter(isAudioEffect),
)

export const activeAudioNodeIdsSelector = createSelector(
  orderedAudioNodesMetaSelector,
  connectionsSelector,
  mainOutNodeSelector,
  (meta, connections, mainOut) => {
    const connectedToMain = hasConnectionTo(connections, mainOut.id)

    return meta.map(({ id }) => id).filter(connectedToMain)
  },
)

export const connectableSourcesSelector = createSelector(
  orderedInstrumentsMetaSelector,
  orderedAudioEffectsMetaSelector,
  (instruments, effects) => [...instruments, ...effects],
)

export const connectableTargetsSelector = createSelector(
  orderedAudioEffectsMetaSelector,
  mainOutMetaSelector,
  (effects, out) => [...effects, out],
)
