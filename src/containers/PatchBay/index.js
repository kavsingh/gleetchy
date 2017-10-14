import { connect } from 'react-redux'
import { equals } from 'ramda'
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
  checkActiveNode: (from, to) => {
    const [fromId, toId] = [from, to].map(({ id }) => id)

    return !!connectionsSelector(state).find(equals([fromId, toId]))
  },
})

const mapDispatchToProps = dispatch => ({
  onNodeClick: (from, to) => dispatch(connectionToggle(from.id, to.id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PatchBay)
