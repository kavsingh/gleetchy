import { pick } from 'ramda'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { isSameConnection, hasDownstreamConnectionTo } from '~/util/audio'
import { mainOutSelector } from '~/state/audioContexts/selectors'
import { instrumentsSelector } from '~/state/instruments/selectors'
import { audioEffectsSelector } from '~/state/audioEffects/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'
import PatchBay from './PatchBay'

const pickNodeProps = pick(['label', 'color', 'id'])

const fromNodesSelector = createSelector(
  instrumentsSelector,
  audioEffectsSelector,
  (instruments, audioEffects) =>
    [...Object.values(instruments), ...audioEffects].map(pickNodeProps),
)

const toNodesSelector = createSelector(
  audioEffectsSelector,
  mainOutSelector,
  (audioEffects, mainOut) => [...audioEffects, mainOut].map(pickNodeProps),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatchBay)
