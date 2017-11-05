import { identity, path } from 'ramda'
import { createSelector } from 'reselect'
import { hasDownstreamConnectionTo } from '~/util/audio'
import { mainOutSelector } from '~/state/audioContexts/selectors'
import { connectionsSelector } from '~/state/connections/selectors'

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
