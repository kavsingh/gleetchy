import { identity, path } from 'ramda'
import { createSelector } from 'reselect'
import { mainOutSelector } from '../audioContexts/selectors'
import { connectionsSelector } from '../connections/selectors'
import { hasDownstreamConnectionTo } from '../../util/audio'

const instrumentsStateSelector = state => state.instruments

export const instrumentsSelector = createSelector(
  instrumentsStateSelector,
  identity,
)

export const activeInstrumentsSelector = createSelector(
  instrumentsSelector,
  connectionsSelector,
  mainOutSelector,
  (instruments, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(
      path(['id'], mainOut),
      connections,
    )

    return instruments.map(path(['id'])).filter(connectedToMain)
  },
)
