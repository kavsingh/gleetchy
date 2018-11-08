import { connect } from 'react-redux'
import { Omit } from 'type-zoo'

import { audioEffectsSelector } from '~/state/audioEffects/selectors'
import { clearAudioEngineEventsAction } from '~/state/audioEngine/actions'
import { audioEngineEventsSelector } from '~/state/audioEngine/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { instrumentsSelector } from '~/state/instruments/selectors'

import AudioEngine, { AudioEngineProps } from './AudioEngine'

type AudioEnginePropsMap = Omit<AudioEngineProps, 'clearAudioEngineEvents'>
type AudioEngineDispatchMap = Pick<AudioEngineProps, 'clearAudioEngineEvents'>

export default connect(
  (state: ApplicationState): AudioEnginePropsMap => ({
    audioEngineEvents: audioEngineEventsSelector(state),
    connections: connectionsSelector(state),
    isPlaying: isPlayingSelector(state),
    nodes: [
      ...Object.values(instrumentsSelector(state)),
      ...audioEffectsSelector(state),
    ],
  }),
  (dispatch): AudioEngineDispatchMap => ({
    clearAudioEngineEvents: () => dispatch(clearAudioEngineEventsAction()),
  }),
)(AudioEngine)
