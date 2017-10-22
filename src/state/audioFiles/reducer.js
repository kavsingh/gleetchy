import { omit, without } from 'ramda'
import {
  AUDIO_FILE_LOAD_START,
  AUDIO_FILE_LOAD_COMPLETE,
  AUDIO_FILE_LOAD_ERROR,
  AUDIO_FILE_DECODE_START,
  AUDIO_FILE_DECODE_COMPLETE,
  AUDIO_FILE_DECODE_ERROR,
} from './actionTypes'

const defaultState = {
  loadingIds: [],
  decodingIds: [],
  loadErrors: {},
  decodeErrors: {},
  files: {},
}

const audioFilesReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case AUDIO_FILE_LOAD_START:
      return {
        ...state,
        loadErrors: omit([payload.id], state.loadErrors),
        loadingIds: without([payload.id], state.loadingIds).concat(payload.id),
      }
    case AUDIO_FILE_LOAD_COMPLETE:
      return {
        ...state,
        loadErrors: omit([payload.id], state.loadErrors),
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
      return {
        ...state,
        loadErrors: { ...state.loadErrors, [payload.id]: payload.error },
        loadingIds: without([payload.id], state.loadingIds),
      }
    case AUDIO_FILE_DECODE_START:
      return {
        ...state,
        decodeErrors: omit([payload.id], state.decodeErrors),
        decodingIds: without([payload.id], state.decodingIds).concat(
          payload.id,
        ),
      }
    case AUDIO_FILE_DECODE_COMPLETE:
      return {
        ...state,
        decodeErrors: omit([payload.id], state.decodeErrors),
        decodingIds: without([payload.id], state.decodingIds),
        files: {
          ...state.files,
          [payload.id]: {
            ...(state.files[payload.id] || {}),
            ...payload.file,
          },
        },
      }
    case AUDIO_FILE_DECODE_ERROR:
      return {
        ...state,
        decodeErrors: { ...state.decodeErrors, [payload.id]: payload.error },
        decodingIds: without([payload.id], state.decodingIds),
      }
    default:
      return state
  }
}

export default audioFilesReducer
