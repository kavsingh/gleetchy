import { prop } from 'ramda'
import { createSelector } from 'reselect'

const engineStateSelector = state => state.engine

export const engineEventsSelector = createSelector(
  engineStateSelector,
  prop('events'),
)
