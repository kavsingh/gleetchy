import { equals } from 'ramda'
import { warn } from '../../util'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
  DELAY_UPDATE_PROPS,
  REVERB_UPDATE_PROPS,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  GRAPH_UPDATE,
} from './actionTypes'

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  connections: [
    ['loop0', 'mainOut'],
    ['loop1', 'reverb'],
    ['reverb', 'mainOut'],
  ],
  delay: { delayTime: 0.6, wetDryRatio: 0 },
  reverb: { wetDryRatio: 0 },
  loopers: [
    {
      id: 'loop0',
      label: 'Loop 0',
      fileName: '',
      fileType: '',
      audioBuffer: undefined,
      gain: 0.5,
      loopStart: 0,
      loopEnd: 1,
      playbackRate: 1,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
    },
    {
      id: 'loop1',
      label: 'Loop 1',
      fileName: '',
      fileType: '',
      audioBuffer: undefined,
      gain: 0.5,
      loopStart: 0,
      loopEnd: 1,
      playbackRate: 1,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
    },
  ],
}

const updateLooper = (state, { id, props = {} }) => {
  const loopers = [...state.loopers]
  const looperState = state.loopers.find(looper => looper.id === id)

  if (!looperState) return state

  Object.assign(looperState, props)

  return { ...state, loopers }
}

const updateConnections = (state, connection, type) => {
  const { connections } = state

  const currentIdx = connections.findIndex(equals(connection))

  if (type === 'add' && currentIdx === -1) {
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
    case LOOPER_UPDATE_PROPS: {
      const nextState = updateLooper(state, payload)

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
        ...updateLooper(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_ERROR:
      warn(payload.error, type, payload)
      return state
    case DELAY_UPDATE_PROPS: {
      return {
        ...state,
        delay: { ...state.delay, ...payload.props },
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
    case REVERB_UPDATE_PROPS: {
      return {
        ...state,
        reverb: { ...state.reverb, ...payload.props },
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    }
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
