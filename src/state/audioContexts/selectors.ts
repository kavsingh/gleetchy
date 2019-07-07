import { createSelector } from 'reselect'

import { MAIN_OUT_ID } from '~/constants/audio'
import { ApplicationState } from '~/state/configureStore'

const audioContextsStateSelector = (state: ApplicationState) =>
  state.audioContexts

export const audioContextsSelector = createSelector(
  audioContextsStateSelector,
  ({ byId }) => byId,
)

export const mainOutSelector = createSelector(
  audioContextsStateSelector,
  ({ byId }) => byId[MAIN_OUT_ID],
)
