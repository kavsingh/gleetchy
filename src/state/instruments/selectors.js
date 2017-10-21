import { identity } from 'ramda'
import { createSelector } from 'reselect'

const instrumentsStateSelector = state => state.instruments

export const instrumentsSelector = createSelector(
  instrumentsStateSelector,
  identity,
)
