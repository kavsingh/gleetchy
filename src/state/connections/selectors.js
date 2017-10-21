import { createSelector } from 'reselect'

const connectionsSelector = state => state.connections

export const keySelector = createSelector(
  connectionsSelector,
  connections => connections.key,
)
