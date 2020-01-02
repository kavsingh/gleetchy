import { globalPlaybackReducer } from './reducer'

describe('globalPlaybackReducer', () => {
  it('responds to playback actions', () => {
    expect(
      globalPlaybackReducer(
        { isPlaying: false },
        { type: 'GLOBAL_PLAYBACK_START' },
      ),
    ).toEqual({ isPlaying: true })
    expect(
      globalPlaybackReducer(
        { isPlaying: true },
        { type: 'GLOBAL_PLAYBACK_STOP' },
      ),
    ).toEqual({ isPlaying: false })
  })
})
