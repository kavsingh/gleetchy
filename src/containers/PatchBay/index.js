import { connect } from 'react-redux'
import { isSameConnection, hasDownstreamConnectionTo } from '../../util/audio'
import {
  fromNodesSelector,
  toNodesSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import { connectionToggle } from '../../state/gleetchy/actions'
import PatchBay from '../../components/PatchBay'

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
  onNodeClick: (from, to) => dispatch(connectionToggle(from.id, to.id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PatchBay)
