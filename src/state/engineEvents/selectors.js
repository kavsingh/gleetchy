import { identity } from 'ramda'
import { createSelector } from 'reselect'

const engineEventsStateSelector = state => state.engineEvents

export const engineEventsSelector = createSelector(
  engineEventsStateSelector,
  identity,
)
