import { head, identity } from 'ramda'
import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configureStore'

const audioContextsStateSelector = (state: ApplicationState) =>
  state.audioContexts

export const audioContextsSelector = createSelector(
  audioContextsStateSelector,
  identity,
)

export const mainOutSelector = createSelector(
  audioContextsSelector,
  head,
)
