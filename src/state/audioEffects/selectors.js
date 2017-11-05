import { identity, path, propEq } from 'ramda'
import { createSelector } from 'reselect'
import { hasDownstreamConnectionTo } from '~/util/audio'
import { mainOutSelector } from '~/state/audioContexts/selectors'
import { connectionsSelector } from '~/state/connections/selectors'

const audioEffectsStateSelector = state => state.audioEffects

export const audioEffectsSelector = createSelector(
  audioEffectsStateSelector,
  identity,
)

export const activeAudioEffectsSelector = createSelector(
  audioEffectsSelector,
  connectionsSelector,
  mainOutSelector,
  (audioEffects, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(
      path(['id'], mainOut),
      connections,
    )

    return audioEffects
      .map(path(['id']))
      .filter(id => connections.some(propEq('to', id)) && connectedToMain(id))
  },
)
