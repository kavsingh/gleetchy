import { connect } from 'react-redux'

import { audioEffectsSelector } from '~/state/audioEffects/selectors'
import { clearAudioEngineEventsAction } from '~/state/audioEngine/actions'
import { audioEngineEventsSelector } from '~/state/audioEngine/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { instrumentsSelector } from '~/state/instruments/selectors'

import AudioEngine from './AudioEngine'

export default connect(
  (state: ApplicationState) => ({
    audioEngineEvents: audioEngineEventsSelector(state),
    connections: connectionsSelector(state),
    isPlaying: isPlayingSelector(state),
    nodes: [
      ...Object.values(instrumentsSelector(state)),
      ...Object.values(audioEffectsSelector(state)),
    ],
  }),
  dispatch => ({
    clearAudioEngineEvents: () => dispatch(clearAudioEngineEventsAction()),
  }),
)(AudioEngine)
