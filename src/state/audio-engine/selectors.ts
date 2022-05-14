import type { AppState } from '~/state/configure-store'

export const selectAudioContext = (state: AppState) =>
  state.audioEngine.audioContext

export const selectAudioEngineEvents = (state: AppState) =>
  state.audioEngine.events
