import { identity } from 'ramda'
import { createSelector } from 'reselect'

const audioContextsStateSelector = state => state.audioContexts

export const audioContextsSelector = createSelector(
  audioContextsStateSelector,
  identity,
)
