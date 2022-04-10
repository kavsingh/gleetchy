import type { AppState } from '~/state/configure-store'

export const selectIsPlaying = (state: AppState) =>
  state.globalPlayback.isPlaying
