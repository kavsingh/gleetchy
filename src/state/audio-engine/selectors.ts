import type { AppState } from '~/state/configure-store'

export const selectAudioEngineEvents = (state: AppState) =>
  state.audioEngine.events
