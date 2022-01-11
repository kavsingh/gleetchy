import type { ApplicationState } from '~/state/configure-store'

export const selectIsPlaying = (state: ApplicationState) =>
  state.globalPlayback.isPlaying
