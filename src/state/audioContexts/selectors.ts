import { head, identity } from 'ramda'
import { createSelector } from 'reselect'

const audioContextsStateSelector = (state: any) => state.audioContexts

export const audioContextsSelector = createSelector(
  audioContextsStateSelector,
  identity,
)

export const mainOutSelector = createSelector(audioContextsSelector, head)
