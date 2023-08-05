import type { AppState } from "~/app-store/create";

export const selectConnections = (state: AppState) => state.connections;
