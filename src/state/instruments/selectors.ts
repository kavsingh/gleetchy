import { identity, path } from 'ramda'
import { createSelector } from 'reselect'

import { mainOutSelector } from '~/state/audioContexts/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { hasDownstreamConnectionTo } from '~/util/audio'

const instrumentsStateSelector = (state: ApplicationState) => state.instruments

export const instrumentsSelector = createSelector(
  instrumentsStateSelector,
  identity,
)

export const activeInstrumentsSelector = createSelector(
  instrumentsSelector,
  connectionsSelector,
  mainOutSelector,
  (instruments, connections, mainOut) => {
    const connectedToMain = hasDownstreamConnectionTo(mainOut.id, connections)

    return instruments.map(path(['id'])).filter(connectedToMain)
  },
)