import { equals, propEq } from 'ramda'
import { warn } from '../../util'
import { MAIN_OUT_ID } from '../../constants/audio'
import { FX_REVERB, FX_DELAY, INS_LOOP } from '../../constants/nodeTypes'
import nodeProps from '../../constants/nodeProps'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_PROPS,
  NODE_ADD,
  LOOP_LOAD_FILE_COMPLETE,
  LOOP_LOAD_FILE_DECODE_COMPLETE,
  LOOP_LOAD_FILE_ERROR,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  GRAPH_UPDATE,
  STATE_REPLACE,
} from './actionTypes'

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  connections: [['loop0', MAIN_OUT_ID], ['loop1', MAIN_OUT_ID]],
  nodes: [
    {
      id: 'reverb0',
      label: 'R0',
      type: FX_REVERB,
      props: { ...nodeProps[FX_REVERB] },
    },
    {
      id: 'delay0',
      label: 'D0',
      type: FX_DELAY,
      props: { ...nodeProps[FX_DELAY] },
    },
    {
      id: 'loop0',
      label: 'L0',
      type: INS_LOOP,
      props: { ...nodeProps[INS_LOOP] },
    },
    {
      id: 'loop1',
      label: 'L1',
      type: INS_LOOP,
      props: { ...nodeProps[INS_LOOP] },
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

const addNode = (state, { type }) => {
  if (type === INS_LOOP) {
    const loops = state.nodes.filter(propEq('type', INS_LOOP))
    const id = loops.length

    const node = {
      type,
      id: `loop${id}`,
      label: `L${id}`,
      props: { ...nodeProps.INS_LOOP },
    }

    return {
      ...state,
      nodes: state.nodes.concat(node),
      connections: state.connections.concat([[node.id, MAIN_OUT_ID]]),
    }
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
    case NODE_ADD: {
      return {
        ...addNode(state, payload),
        engineEvents: [
          ...state.engineEvents,
          { type: NODE_ADD },
          { type: GRAPH_UPDATE },
        ],
      }
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
