import { createSelector } from 'reselect'
import { identity, filter, map, pick, pipe } from 'ramda'
import { MAIN_OUT_ID } from '../../constants/audio'
import { isFx, isInstrument, sortByType } from '../../util/audio'

const nodeStateSelector = state => state.gleetchy.nodes
const isPlayingStateSelector = state => state.gleetchy.isPlaying
const engineEventsStateSelector = state => state.gleetchy.engineEvents
const connectionsStateSelector = state => state.gleetchy.connections

export const nodesSelector = createSelector(nodeStateSelector, identity)

export const fxSelector = createSelector(
  nodesSelector,
  pipe(filter(isFx), sortByType),
)

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

const patchNodeProps = map(pick(['id', 'label', 'type']))

export const fromNodesSelector = createSelector(
  instrumentsSelector,
  fxSelector,
  (instruments, fx) => patchNodeProps([...sortByType(instruments), ...fx]),
)

export const toNodesSelector = createSelector(fxSelector, fx =>
  patchNodeProps(sortByType(fx)).concat({
    id: MAIN_OUT_ID,
    label: 'Main',
    type: 'Main out',
  }),
)
