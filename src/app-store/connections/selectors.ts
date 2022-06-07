import type { AppState } from '~/app-store/configure-store'

export const selectConnections = (state: AppState) => state.connections
