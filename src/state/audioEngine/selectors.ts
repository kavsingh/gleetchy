import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configureStore'

const audioEngineStateSelector = (state: ApplicationState) => state.audioEngine

export const audioEngineEventsSelector = createSelector(
  audioEngineStateSelector,
  ({ events }) => events,
)
