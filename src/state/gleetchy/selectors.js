import { createSelector } from 'reselect'
import { identity, filter } from 'ramda'
import { MAIN_OUT_ID } from '../../constants/audio'
import { isFx, isInstrument } from '../../util/audio'

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
  fxSelector,
  (connections, fx) =>
    fx.map(({ id }) => id).reduce((accum, fxId) => {
      const active = connections.find(connection => connection[1] === fxId)

      if (active) accum.push(fxId)

      return accum
    }, []),
)

export const fromNodesSelector = createSelector(
  instrumentsSelector,
  fxSelector,
  (instruments, fx) => [
    ...instruments.map(({ id, label }) => ({
      id,
      label,
      title: label,
    })),
    ...fx.map(({ id, label }) => ({
      id,
      label,
      title: label,
    })),
  ],
)

export const toNodesSelector = createSelector(fxSelector, fx =>
  fx
    .map(({ id, label }) => ({
      id,
      label,
      title: label,
    }))
    .concat({ id: MAIN_OUT_ID, label: 'Main', title: 'Main out' }),
)
