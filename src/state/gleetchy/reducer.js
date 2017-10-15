/*
{"gleetchy":{"nodes":[{"id":"reverb0","label":"Reverb 0","type":"FX_REVERB","props":{"wetDryRatio":0.5}},{"id":"delay0","label":"Delay 0","type":"FX_DELAY","props":{"delayTime":0.6,"wetDryRatio":0.5}},{"id":"looper0","label":"Loop 0","type":"INS_LOOPER","props":{"fileName":"","fileType":"","gain":0,"loopStart":0,"loopEnd":1,"playbackRate":1,"eqLow":0.8703703703703705,"eqMid":0.6851851851851856,"eqHigh":0}},{"id":"looper1","label":"Loop 1","type":"INS_LOOPER","props":{"fileName":"","fileType":"","gain":0.5,"loopStart":0,"loopEnd":1,"playbackRate":1,"eqLow":0,"eqMid":0,"eqHigh":0}}],"connections":[["loop0","mainOut"],["loop1","mainOut"]]}}
*/

import { equals, propEq } from 'ramda'
import { warn } from '../../util'
import { MAIN_OUT_ID } from '../../constants/audio'
import { FX_REVERB, FX_DELAY, INS_LOOPER } from '../../constants/nodeTypes'
import nodeProps from '../../constants/nodeProps'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_PROPS,
  NODE_ADD,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  GRAPH_UPDATE,
  STATE_REPLACE,
} from './actionTypes'

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  connections: [['looper0', MAIN_OUT_ID], ['looper1', MAIN_OUT_ID]],
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
      id: 'looper0',
      label: 'L0',
      type: INS_LOOPER,
      props: { ...nodeProps[INS_LOOPER] },
    },
    {
      id: 'looper1',
      label: 'L1',
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

const addNode = (state, { type }) => {
  if (type === INS_LOOPER) {
    const loopers = state.nodes.filter(propEq('type', INS_LOOPER))
    const id = loopers.length

    const node = {
      type,
      id: `looper${id}`,
      label: `L${id}`,
      props: { ...nodeProps.INS_LOOPER },
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
