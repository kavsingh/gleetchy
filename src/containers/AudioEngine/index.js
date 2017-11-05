import { connect } from 'react-redux'
import { instrumentsSelector } from '~/state/instruments/selectors'
import { audioEffectsSelector } from '~/state/audioEffects/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { audioEngineEventsSelector } from '~/state/audioEngine/selectors'
import { clearAudioEngineEventsAction } from '~/state/audioEngine/actions'
import AudioEngine from './AudioEngine'

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
    audioEngineEvents: audioEngineEventsSelector(state),
    nodes: [...instrumentsSelector(state), ...audioEffectsSelector(state)],
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    clearAudioEngineEvents: () => dispatch(clearAudioEngineEventsAction()),
  }),
)(AudioEngine)
