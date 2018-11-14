import { connect } from 'react-redux'

import { addDelayAction, addReverbAction } from '~/state/audioEffects/actions'
import { orderedAudioEffectsSelector } from '~/state/audioEffects/selectors'
import { ApplicationState } from '~/state/configureStore'

import AudioEffectsRack from './AudioEffectsRack'

export default connect(
  (state: ApplicationState) => ({
    audioEffects: orderedAudioEffectsSelector(state),
  }),
  dispatch => ({
    addDelay: () => dispatch(addDelayAction()),
    addReverb: () => dispatch(addReverbAction()),
  }),
)(AudioEffectsRack)
