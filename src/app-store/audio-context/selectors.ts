import type { AppState } from '~/app-store/configure-store'

export const selectAudioContext = (state: AppState) =>
  state.audioContext.audioContext
