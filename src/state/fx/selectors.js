import { identity, path, propEq } from 'ramda'
import { createSelector } from 'reselect'
import { mainOutSelector } from '../audioContexts/selectors'
import { connectionsSelector } from '../connections/selectors'
import { hasDownstreamConnectionTo } from '../../util/audio'

const fxStateSelector = state => state.fx

export const fxSelector = createSelector(fxStateSelector, identity)

export const activeFxSelector = createSelector(
  fxSelector,
  connectionsSelector,
  mainOutSelector,
  (fx, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(
      path(['id'], mainOut),
      connections,
    )

    return fx
      .map(path(['id']))
      .filter(id => connections.some(propEq('to', id)) && connectedToMain(id))
  },
)
