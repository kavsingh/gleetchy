import { connect } from 'react-redux'
import { isSameConnection } from '../../util/audio'
import {
  fromNodesSelector,
  toNodesSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import { connectionToggle } from '../../state/gleetchy/actions'
import PatchBay from '../../components/PatchBay'

const mapStateToProps = state => ({
  fromNodes: fromNodesSelector(state),
  toNodes: toNodesSelector(state),
  checkActiveNode: ({ id: from }, { id: to }) =>
    !!connectionsSelector(state).find(isSameConnection({ from, to })),
})

const mapDispatchToProps = dispatch => ({
  onNodeClick: (from, to) => dispatch(connectionToggle(from.id, to.id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PatchBay)
