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

const canConnectNodes = connections => (fromId, toId) =>
  fromId !== toId && !hasDownstreamConnectionTo(fromId, connections, toId)

const mapStateToProps = state => ({
  fromNodes: fromNodesSelector(state),
  toNodes: toNodesSelector(state),
  getConnection: (fromId, toId) =>
    connectionsSelector(state).find(
      isSameConnection({ from: fromId, to: toId }),
    ),
  canConnect: canConnectNodes(connectionsSelector(state)),
})

const mapDispatchToProps = dispatch => ({
  onNodeClick: (from, to) => dispatch(toggleConnectionAction(from.id, to.id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PatchBay)
