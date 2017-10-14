import { equals } from 'ramda'
import { warn } from '../../util'
import { FX_REVERB, FX_DELAY, INS_LOOPER } from '../../constants/nodeTypes'
import nodeProps from '../../constants/nodeProps'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  GRAPH_UPDATE,
} from './actionTypes'

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  connections: [['loop0', 'mainOut'], ['loop1', 'mainOut']],
  nodes: [
    {
      id: 'reverb',
      label: 'Reverb',
      type: FX_REVERB,
      props: { ...nodeProps[FX_REVERB] },
    },
    {
      id: 'delay',
      label: 'Delay',
      type: FX_DELAY,
      props: { ...nodeProps[FX_DELAY] },
    },
    {
      id: 'loop0',
      label: 'Loop 0',
      type: INS_LOOPER,
      props: { ...nodeProps[INS_LOOPER] },
    },
    {
      id: 'loop1',
      label: 'Loop 1',
      type: INS_LOOPER,
      props: { ...nodeProps[INS_LOOPER] },
    },
  ],
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
    const newConnections = [...connections]

    newConnections.splice(currentIdx, 1)

    return { ...state, connections: newConnections }
  }

  return state
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
    case NODE_UPDATE_PROPS: {
      const nextState = updateNode(state, payload)

      if (nextState === state) return state

      return {
        ...nextState,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
    case LOOPER_LOAD_FILE_COMPLETE:
      return {
        ...state,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_DECODE_COMPLETE:
      return {
        ...updateNode(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_ERROR:
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
    case ENGINE_EVENTS_CLEAR:
      return { ...state, engineEvents: [] }
    default:
      return state
  }
}
/* eslint-enable complexity */

export default gleetchy
