import type { ApplicationState } from '~/state/configure-store'

export const selectConnections = (state: ApplicationState) => state.connections
