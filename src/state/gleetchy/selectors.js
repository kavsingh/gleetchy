import { createSelector } from 'reselect'
import { identity } from 'ramda'

const loopersStateSelector = state => state.gleetchy.loopers
const delayStateSelector = state => state.gleetchy.delay
const reverbStateSelector = state => state.gleetchy.reverb
const isPlayingStateSelector = state => state.gleetchy.isPlaying
const engineEventsStateSelector = state => state.gleetchy.engineEvents

export const loopersSelector = createSelector(loopersStateSelector, identity)

export const delaySelector = createSelector(delayStateSelector, identity)

export const reverbSelector = createSelector(reverbStateSelector, identity)

export const isPlayingSelector = createSelector(
  isPlayingStateSelector,
  identity,
)

export const engineEventsSelector = createSelector(
  engineEventsStateSelector,
  identity,
)
