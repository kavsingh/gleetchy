import { createSelector } from 'reselect'
import { identity, filter, pipe, head, propEq } from 'ramda'
import { FX_DELAY, FX_REVERB, INS_LOOPER } from '../../constants/nodeTypes'
import { isFx, isInstrument } from '../../util/audio'

const typeEquals = propEq('type')

const nodeStateSelector = state => state.gleetchy.nodes
const isPlayingStateSelector = state => state.gleetchy.isPlaying
const engineEventsStateSelector = state => state.gleetchy.engineEvents
const connectionsStateSelector = state => state.gleetchy.connections

export const nodesSelector = createSelector(nodeStateSelector, identity)

export const fxSelector = createSelector(nodesSelector, filter(isFx))

export const instrumentsSelector = createSelector(
  nodesSelector,
  filter(isInstrument),
)

export const loopersSelector = createSelector(
  instrumentsSelector,
  filter(typeEquals(INS_LOOPER)),
)

export const delaySelector = createSelector(
  fxSelector,
  pipe(filter(typeEquals(FX_DELAY)), head),
)

export const reverbSelector = createSelector(
  fxSelector,
  pipe(filter(typeEquals(FX_REVERB)), head),
)

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
