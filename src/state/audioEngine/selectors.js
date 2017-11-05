import { prop } from 'ramda'
import { createSelector } from 'reselect'

const audioEngineStateSelector = state => state.audioEngine

export const audioEngineEventsSelector = createSelector(
  audioEngineStateSelector,
  prop('events'),
)
