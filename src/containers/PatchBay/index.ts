import { pick } from 'ramda'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createSelector } from 'reselect'

import { mainOutSelector } from '~/state/audioContexts/selectors'
import { audioEffectsSelector } from '~/state/audioEffects/selectors'
import { ApplicationState } from '~/state/configureStore'
import { toggleConnectionAction } from '~/state/connections/actions'
import { connectionsSelector } from '~/state/connections/selectors'
import { instrumentsSelector } from '~/state/instruments/selectors'
import { AudioNodeConnection, AudioNodeIdentifier } from '~/types'
import { hasDownstreamConnectionTo, isSameConnection } from '~/util/audio'

import PatchBay from './PatchBay'

const pickNodeProps = pick(['label', 'color', 'id'])

const fromNodesSelector = createSelector(
  instrumentsSelector,
  audioEffectsSelector,
  (instruments, audioEffects) =>
    [...Object.values(instruments), ...Object.values(audioEffects)].map(
      pickNodeProps,
    ),
)

const toNodesSelector = createSelector(
  audioEffectsSelector,
  mainOutSelector,
  (audioEffects, mainOut) =>
    [...Object.values(audioEffects), mainOut].map(pickNodeProps),
)

const canConnectNodes = (connections: AudioNodeConnection[]) => (
  { id: from }: AudioNodeIdentifier,
  { id: to }: AudioNodeIdentifier,
) => from !== to && !hasDownstreamConnectionTo(from, connections, to)

const mapStateToProps = (state: ApplicationState) => ({
  canConnect: canConnectNodes(connectionsSelector(state)),
  fromNodes: fromNodesSelector(state),
  getConnection: (
    { id: from }: AudioNodeIdentifier,
    { id: to }: AudioNodeIdentifier,
  ) => connectionsSelector(state).find(isSameConnection({ from, to })),
  toNodes: toNodesSelector(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onNodeClick: (
    { id: from }: AudioNodeIdentifier,
    { id: to }: AudioNodeIdentifier,
  ) => dispatch(toggleConnectionAction(from, to) as any),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatchBay as any)
