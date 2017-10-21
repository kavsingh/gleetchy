import { identity } from 'ramda'
import { createSelector } from 'reselect'

const connectionsStateSelector = state => state.connections

export const connectionsSelector = createSelector(
  connectionsStateSelector,
  identity,
)
