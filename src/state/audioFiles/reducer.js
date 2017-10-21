import { omit, without } from 'ramda'
import {
  ENGINE_DECODE_ARRAY_BUFFER_COMPLETE,
  ENGINE_DECODE_ARRAY_BUFFER_ERROR,
} from '../engine/actionTypes'
import {
  AUDIO_FILE_LOAD_START,
  AUDIO_FILE_LOAD_COMPLETE,
  AUDIO_FILE_LOAD_ERROR,
} from './actionTypes'

const defaultState = {
  loadingIds: [],
  errors: {},
  files: {},
}

const audioBuffersReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case AUDIO_FILE_LOAD_START:
      return {
        ...state,
        errors: omit([payload.id], state.errors),
        loadingIds: without([payload.id], state.loadingIds).concat(payload.id),
        decodingIds: without([payload.id], state.loadingIds).concat(payload.id),
      }
    case AUDIO_FILE_LOAD_COMPLETE:
      return {
        ...state,
        errors: omit([payload.id], state.errors),
        loadingIds: without([payload.id], state.loadingIds),
        files: {
          ...state.files,
          [payload.id]: {
            ...(state.files[payload.id] || {}),
            ...omit(['buffer'], payload.file),
          },
        },
      }
    case AUDIO_FILE_LOAD_ERROR:
    case ENGINE_DECODE_ARRAY_BUFFER_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [payload.id]: payload.error },
        loadingIds: without([payload.id], state.loadingIds),
        decodingIds: without([payload.id], state.decodingIds),
      }
    case ENGINE_DECODE_ARRAY_BUFFER_COMPLETE:
      return {
        ...state,
        errors: omit([payload.id], state.errors),
        loadingIds: without([payload.id], state.loadingIds),
        decodingIds: without([payload.id], state.decodingIds),
        files: {
          ...state.files,
          [payload.id]: {
            ...(state.files[payload.id] || {}),
            audioBuffer: payload.audioBuffer,
          },
        },
      }
    default:
      return state
  }
}

export default audioBuffersReducer
