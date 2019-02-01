import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { mainOutSelector } from '~/state/audioContexts/selectors'
import {
  audioEffectsSelector,
  orderedAudioEffectsSelector,
} from '~/state/audioEffects/selectors'
import { ApplicationState } from '~/state/configureStore'
import { toggleConnectionAction } from '~/state/connections/actions'
import { connectionsSelector } from '~/state/connections/selectors'
import {
  instrumentsSelector,
  orderedInstrumentsSelector,
} from '~/state/instruments/selectors'
import { AudioNodeConnection, AudioNodeIdentifier } from '~/types'
import { hasDownstreamConnectionTo, isSameConnection } from '~/util/audio'

import PatchBay from './PatchBay'

const getNodeLabel = (state: ApplicationState) => (id: string) => {
  const node = instrumentsSelector(state)[id] || audioEffectsSelector(state)[id]
  return node ? node.label : 'unknown'
}

const fromNodesSelector = createSelector(
  orderedInstrumentsSelector,
  orderedAudioEffectsSelector,
  (instruments, audioEffects) => [
    ...Object.values(instruments),
    ...Object.values(audioEffects),
  ],
)

const toNodesSelector = createSelector(
  audioEffectsSelector,
  mainOutSelector,
  (audioEffects, mainOut) => [...Object.values(audioEffects), mainOut],
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
  getNodeLabel: getNodeLabel(state),
  toNodes: toNodesSelector(state),
})

const mapDispatchToProps = (dispatch: Function) => ({
  onNodeClick: (
    { id: from }: AudioNodeIdentifier,
    { id: to }: AudioNodeIdentifier,
  ) => dispatch(toggleConnectionAction(from, to)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatchBay)
