import type { AppState } from '~/state/configure-store'

export const selectConnections = (state: AppState) => state.connections
