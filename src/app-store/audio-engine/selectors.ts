import type { AppState } from '~/app-store/configure-store'

export const selectAudioEngineEvents = (state: AppState) =>
  state.audioEngine.events
