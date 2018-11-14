import { __ } from 'ramda'
import { connect } from 'react-redux'

import {
  addDelayAction,
  addReverbAction,
  removeAudioEffectAction,
  updateAudioEffectLabelAction,
  updateAudioEffectPropsAction,
} from '~/state/audioEffects/actions'
import {
  activeAudioEffectsSelector,
  audioEffectsSelector,
} from '~/state/audioEffects/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { getConnectionsFor } from '~/util/audio'
import AudioEffectsRack from './AudioEffectsRack'

export default connect(
  (state: ApplicationState) => ({
    activeAudioEffects: activeAudioEffectsSelector(state),
    audioEffects: audioEffectsSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    addDelay: () => dispatch(addDelayAction()),
    addReverb: () => dispatch(addReverbAction()),
    removeAudioEffect: (id: string) => dispatch(removeAudioEffectAction(id)),
    updateAudioEffect: (id: string, props: any) =>
      dispatch(updateAudioEffectPropsAction(id, props)),
    updateAudioEffectLabel: (id: string, label: string) =>
      dispatch(updateAudioEffectLabelAction(id, label)),
  }),
)(AudioEffectsRack)
