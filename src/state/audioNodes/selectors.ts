import { createSelector } from 'reselect'
import { identity } from 'ramda'

import { AudioNodeMeta } from '~/types'
import { MAIN_OUT_ID } from '~/constants/audio'
import { hasDownstreamConnectionTo, isInstrument, isEffect } from '~/util/audio'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'

const audioNodesStateSelector = (state: ApplicationState) => state.audioNodes

export const audioNodesSelector = createSelector(
  audioNodesStateSelector,
  identity,
)

export const orderedAudioNodesMetaSelector = createSelector(
  audioNodesStateSelector,
  (nodes): AudioNodeMeta[] =>
    Object.values(nodes).map(({ id, type, label }) => ({ id, type, label })),
)

export const mainOutNodeSelector = createSelector(
  audioNodesStateSelector,
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
  meta => meta.filter(isEffect),
)

export const activeAudioNodeIdsSelector = createSelector(
  orderedAudioNodesMetaSelector,
  connectionsSelector,
  mainOutNodeSelector,
  (meta, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(mainOut.id, connections)

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
