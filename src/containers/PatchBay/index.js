import { pick } from 'ramda'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { isSameConnection, hasDownstreamConnectionTo } from '../../util/audio'
import { mainOutSelector } from '../../state/audioContexts/selectors'
import { instrumentsSelector } from '../../state/instruments/selectors'
import { fxSelector } from '../../state/fx/selectors'
import { connectionsSelector } from '../../state/connections/selectors'
import { toggleConnectionAction } from '../../state/connections/actions'
import PatchBay from '../../components/PatchBay'

const patchNodeProps = pick(['label', 'color', 'id'])

const fromNodesSelector = createSelector(
  instrumentsSelector,
  fxSelector,
  (instruments, fx) => [...instruments, ...fx].map(patchNodeProps),
)

const toNodesSelector = createSelector(
  fxSelector,
  mainOutSelector,
  (fx, mainOut) => [...fx, mainOut].map(patchNodeProps),
)

const canConnectNodes = connections => ({ id: from }, { id: to }) =>
  from !== to && !hasDownstreamConnectionTo(from, connections, to)

const mapStateToProps = state => ({
  fromNodes: fromNodesSelector(state),
  toNodes: toNodesSelector(state),
  getConnection: ({ id: from }, { id: to }) =>
    connectionsSelector(state).find(isSameConnection({ from, to })),
  canConnect: canConnectNodes(connectionsSelector(state)),
})

const mapDispatchToProps = dispatch => ({
  onNodeClick: ({ id: from }, { id: to }) =>
    dispatch(toggleConnectionAction(from, to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PatchBay)
