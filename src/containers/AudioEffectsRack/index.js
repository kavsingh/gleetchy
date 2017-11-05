import { connect } from 'react-redux'
import { __ } from 'ramda'
import { getConnectionsFor } from '~/util/audio'
import { connectionsSelector } from '~/state/connections/selectors'
import {
  audioEffectsSelector,
  activeAudioEffectsSelector,
} from '~/state/audioEffects/selectors'
import {
  updateAudioEffectPropsAction,
  updateAudioEffectLabelAction,
  addReverbAction,
  addDelayAction,
  removeAudioEffectAction,
} from '~/state/audioEffects/actions'
import AudioEffectsRack from './AudioEffectsRack'

export default connect(
  state => ({
    audioEffects: audioEffectsSelector(state),
    activeAudioEffects: activeAudioEffectsSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    updateAudioEffect: (id, props) =>
      dispatch(updateAudioEffectPropsAction(id, props)),
    updateAudioEffectLabel: (id, label) =>
      dispatch(updateAudioEffectLabelAction(id, label)),
    addReverb: () => dispatch(addReverbAction()),
    addDelay: () => dispatch(addDelayAction()),
    removeAudioEffect: id => dispatch(removeAudioEffectAction(id)),
  }),
)(AudioEffectsRack)
