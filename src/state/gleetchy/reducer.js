import { always, equals, propEq, cond, T } from 'ramda'
import { warn } from '../../util'
import { isInstrument } from '../../util/audio'
import { MAIN_OUT_ID } from '../../constants/audio'
import { FX_REVERB, FX_DELAY, INS_LOOP } from '../../constants/nodeTypes'
import nodeProps from '../../constants/nodeProps'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_LABEL,
  NODE_UPDATE_PROPS,
  NODE_ADD,
  NODE_REMOVE,
  LOOP_LOAD_FILE_COMPLETE,
  LOOP_LOAD_FILE_DECODE_COMPLETE,
  LOOP_LOAD_FILE_ERROR,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  GRAPH_UPDATE,
  STATE_REPLACE,
} from './actionTypes'

const getRootNameForType = cond([
  [equals(INS_LOOP), always('loop')],
  [equals(FX_DELAY), always('delay')],
  [equals(FX_REVERB), always('reverb')],
  [T, 'node'],
])

const defaultLabels = (id, type) => {
  const rootName = getRootNameForType(type)

  return {
    id: `${rootName}${id}`,
    label: `${rootName[0].toUpperCase()}${id}`,
  }
}

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  connections: [['loop0', MAIN_OUT_ID], ['loop1', MAIN_OUT_ID]],
  nodes: [
    [INS_LOOP, 0],
    [INS_LOOP, 1],
    [FX_REVERB, 0],
    [FX_DELAY, 0],
  ].map(([type, id]) => ({
    type,
    ...defaultLabels(id, type),
    props: { ...nodeProps[type] },
  })),
}

const updateNodeLabel = (state, { id, label = '' }) => {
  const nodes = [...state.nodes]
  const nodeState = nodes.find(node => node.id === id)

  if (!nodeState) return state

  Object.assign(nodeState, { label })

  return { ...state, nodes }
}

const updateNode = (state, { id, props = {} }) => {
  const nodes = [...state.nodes]
  const nodeState = nodes.find(node => node.id === id)

  if (!nodeState) return state

  Object.assign(nodeState.props, props)

  return { ...state, nodes }
}

const updateConnections = (state, connection, type) => {
  const { connections } = state

  const currentIdx = connections.findIndex(equals(connection))

  if (type === 'add' && currentIdx === -1) {
    if (connection[0] === connection[1]) return state

    return { ...state, connections: connections.concat([connection]) }
  }

  if (type === 'remove' && currentIdx !== -1) {
    const nextConnections = [...connections]

    nextConnections.splice(currentIdx, 1)

    return { ...state, connections: nextConnections }
  }

  return state
}

const addNode = (state, { type }) => {
  if (![INS_LOOP, FX_DELAY, FX_REVERB].includes(type)) return state

  const typeCount = state.nodes.filter(propEq('type', type))
  const id = typeCount.length

  const node = {
    type,
    ...defaultLabels(id, type),
    props: { ...nodeProps[type] },
  }

  return {
    ...state,
    nodes: state.nodes.concat(node),
    connections: isInstrument(node)
      ? state.connections.concat([[node.id, MAIN_OUT_ID]])
      : state.connections,
  }
}

const removeNode = (state, { id }) => {
  const { nodes, connections } = state
  const deleteIdx = nodes.findIndex(node => node.id === id)

  if (deleteIdx === -1) return state

  const nextNodes = [...nodes]
  const nextConnections = connections.filter(
    connection => !connection.includes(id),
  )

  nextNodes.splice(deleteIdx, 1)

  return { ...state, nodes: nextNodes, connections: nextConnections }
}

/* eslint-disable complexity */
const gleetchy = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case PLAYBACK_START: {
      if (state.isPlaying) return state

      return {
        ...state,
        isPlaying: true,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
    case PLAYBACK_STOP: {
      if (!state.isPlaying) return state

      return {
        ...state,
        isPlaying: false,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
    case NODE_UPDATE_LABEL:
      return updateNodeLabel(state, payload)
    case NODE_UPDATE_PROPS: {
      const nextState = updateNode(state, payload)

      if (nextState === state) return state

      return {
        ...nextState,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
    case LOOP_LOAD_FILE_COMPLETE:
      return {
        ...state,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOP_LOAD_FILE_DECODE_COMPLETE:
      return {
        ...updateNode(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOP_LOAD_FILE_ERROR:
      warn(payload.error, type, payload)
      return state
    case CONNECTION_ADD: {
      const nextState = updateConnections(state, payload.connection, 'add')

      if (state === nextState) return state

      return {
        ...nextState,
        engineEvents: [...state.engineEvents, { type: GRAPH_UPDATE }],
      }
    }
    case CONNECTION_REMOVE: {
      const nextState = updateConnections(state, payload.connection, 'remove')

      if (state === nextState) return state

      return {
        ...nextState,
        engineEvents: [...state.engineEvents, { type: GRAPH_UPDATE }],
      }
    }
    case NODE_ADD:
      return {
        ...addNode(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case NODE_REMOVE:
      return {
        ...removeNode(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case STATE_REPLACE:
      return {
        ...defaultState,
        ...payload.nextState.gleetchy,
        engineEvents: [{ type, payload }],
      }
    case ENGINE_EVENTS_CLEAR:
      return { ...state, engineEvents: [] }
    default:
      return state
  }
}
/* eslint-enable complexity */

export default gleetchy
