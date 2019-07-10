import { createSelector } from 'reselect'
import { identity } from 'ramda'

import { AudioNodeMeta } from '~/types'
import { MAIN_OUT_ID } from '~/constants/audio'
import { hasDownstreamConnectionTo } from '~/util/audio'
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
    Object.values(nodes).map(({ id, type }) => ({ id, type })),
)

export const mainOutNodeSelector = createSelector(
  audioNodesStateSelector,
  nodes => nodes[MAIN_OUT_ID],
)

export const mainOutMetaSelector = createSelector(
  mainOutNodeSelector,
  ({ id, type }): AudioNodeMeta => ({ id, type }),
)

export const orderedInstrumentsMetaSelector = createSelector(
  orderedAudioNodesMetaSelector,
  meta => meta.filter(node => /^instrument/i.test(node.type)),
)

export const orderedAudioEffectsMetaSelector = createSelector(
  orderedAudioNodesMetaSelector,
  meta => meta.filter(node => /^audio_effect/i.test(node.type)),
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
