import { createSelector } from 'reselect'
import { identity, filter, map, pick, pipe } from 'ramda'
import { MAIN_OUT_ID } from '../../constants/audio'
import {
  isFx,
  isInstrument,
  isMainOut,
  sortByType,
  hasDownstreamConnectionTo,
} from '../../util/audio'

const isConnectedToMain = hasDownstreamConnectionTo(MAIN_OUT_ID)
const pickNodeProps = pick(['id', 'label', 'type', 'color'])
const patchNodeProps = map(pickNodeProps)

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

export const mainOutSelector = createSelector(nodesSelector, filter(isMainOut))

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
  nodesSelector,
  (connections, nodes) =>
    connections.map(connection => ({
      ...connection,
      from: pickNodeProps(nodes.find(({ id }) => id === connection.from)),
      to: pickNodeProps(nodes.find(({ id }) => id === connection.to)),
    })),
)

export const activeFXSelector = createSelector(
  connectionsSelector,
  fxSelector,
  (connections, fx) =>
    fx.map(({ id }) => id).reduce((accum, fxId) => {
      const active = connections.find(connection => connection.to === fxId)

      if (!active) return accum
      if (!isConnectedToMain(connections, fxId)) return accum

      accum.push(fxId)

      return accum
    }, []),
)

export const activeInstrumentsSelector = createSelector(
  connectionsSelector,
  instrumentsSelector,
  (connections, instruments) =>
    instruments.map(({ id }) => id).reduce((accum, insId) => {
      if (isConnectedToMain(connections, insId)) accum.push(insId)

      return accum
    }, []),
)

export const fromNodesSelector = createSelector(
  instrumentsSelector,
  fxSelector,
  (instruments, fx) => patchNodeProps([...sortByType(instruments), ...fx]),
)

export const toNodesSelector = createSelector(
  fxSelector,
  mainOutSelector,
  (fx, mains) => patchNodeProps(sortByType(fx)).concat(mains),
)
