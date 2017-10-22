import { identity, propEq, path } from 'ramda'
import { createSelector } from 'reselect'
import { audioFilesSelector } from '../audioFiles/selectors'
import { mainOutSelector } from '../audioContexts/selectors'
import { connectionsSelector } from '../connections/selectors'
import { hasDownstreamConnectionTo } from '../../util/audio'
import { INS_LOOP } from '../../constants/nodeTypes'

const instrumentsStateSelector = state => state.instruments

export const instrumentsSelector = createSelector(
  instrumentsStateSelector,
  identity,
)

export const loopsSelector = createSelector(
  instrumentsSelector,
  audioFilesSelector,
  (instruments, files) =>
    instruments.filter(propEq('type', INS_LOOP)).map(loop => ({
      ...loop,
      props: { ...loop.props, ...(files[loop.id] || {}) },
    })),
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
