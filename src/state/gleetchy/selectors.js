import { createSelector } from 'reselect'
import { identity } from 'ramda'

const loopersStateSelector = state => state.gleetchy.loopers
const delayStateSelector = state => state.gleetchy.delay
const reverbStateSelector = state => state.gleetchy.reverb
const isPlayingStateSelector = state => state.gleetchy.isPlaying
const engineEventsStateSelector = state => state.gleetchy.engineEvents
const connectionsStateSelector = state => state.gleetchy.connections

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

export const connectionsSelector = createSelector(
  connectionsStateSelector,
  identity,
)

export const activeFXSelector = createSelector(
  connectionsSelector,
  connections =>
    ['reverb', 'delay'].reduce((accum, fxId) => {
      const active = connections.find(connection => connection[1] === fxId)

      if (active) accum.push(fxId)

      return accum
    }, []),
)
