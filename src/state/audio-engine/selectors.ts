import type { ApplicationState } from '~/state/configure-store'

export const selectAudioEngineEvents = (state: ApplicationState) =>
  state.audioEngine.events
