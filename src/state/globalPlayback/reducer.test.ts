import reducer from './reducer'

describe('globalPlaybackReducer', () => {
  it('responds to playback actions', () => {
    expect(
      reducer({ isPlaying: false }, { type: 'GLOBAL_PLAYBACK_START' }),
    ).toEqual({ isPlaying: true })
    expect(
      reducer({ isPlaying: true }, { type: 'GLOBAL_PLAYBACK_STOP' }),
    ).toEqual({ isPlaying: false })
  })
})
