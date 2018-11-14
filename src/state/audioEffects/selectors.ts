import { createSelector } from 'reselect'

import { mainOutSelector } from '~/state/audioContexts/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { hasDownstreamConnectionTo } from '~/util/audio'

const audioEffectsStateSelector = (state: ApplicationState) =>
  state.audioEffects

export const audioEffectsSelector = createSelector(
  audioEffectsStateSelector,
  ({ byId }) => byId,
)

export const orderedAudioEffectsSelector = createSelector(
  audioEffectsStateSelector,
  ({ orderedIdentifiers }) => orderedIdentifiers,
)

export const activeAudioEffectsSelector = createSelector(
  orderedAudioEffectsSelector,
  connectionsSelector,
  mainOutSelector,
  (audioEffects, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(mainOut.id, connections)

    return audioEffects.map(({ id }) => id).filter(connectedToMain)
  },
)
