import { omit, without } from 'ramda'
import { Reducer } from 'redux'

import { AudioFileData } from '~/types'

import { AudioFilesAction } from './types'

export interface AudioFilesState {
  decodeErrors: { [key: string]: Error }
  decodingIds: string[]
  files: { [key: string]: AudioFileData }
  loadErrors: { [key: string]: Error }
  loadingIds: string[]
}

const defaultState: AudioFilesState = {
  decodeErrors: {},
  decodingIds: [],
  files: {},
  loadErrors: {},
  loadingIds: [],
}

const audioFilesReducer: Reducer<AudioFilesState, AudioFilesAction> = (
  state = defaultState,
  action,
) => {
  switch (action.type) {
    case 'AUDIO_FILE_LOAD_START':
      return {
        ...state,
        loadErrors: omit([action.payload.id], state.loadErrors),
        loadingIds: without([action.payload.id], state.loadingIds).concat(
          action.payload.id,
        ),
      }
    case 'AUDIO_FILE_LOAD_COMPLETE':
      return {
        ...state,
        files: {
          ...state.files,
          [action.payload.id]: {
            ...(state.files[action.payload.id] || {}),
            ...omit(['buffer'], action.payload.file),
          },
        },
        loadErrors: omit([action.payload.id], state.loadErrors),
        loadingIds: without([action.payload.id], state.loadingIds),
      }
    case 'AUDIO_FILE_LOAD_ERROR':
      return {
        ...state,
        loadErrors: {
          ...state.loadErrors,
          [action.payload.id]: action.payload.error,
        },
        loadingIds: without([action.payload.id], state.loadingIds),
      }
    case 'AUDIO_FILE_DECODE_START':
      return {
        ...state,
        decodeErrors: omit([action.payload.id], state.decodeErrors),
        decodingIds: without([action.payload.id], state.decodingIds).concat(
          action.payload.id,
        ),
      }
    case 'AUDIO_FILE_DECODE_COMPLETE':
      return {
        ...state,
        decodeErrors: omit([action.payload.id], state.decodeErrors),
        decodingIds: without([action.payload.id], state.decodingIds),
        files: {
          ...state.files,
          [action.payload.id]: {
            ...(state.files[action.payload.id] || {}),
            ...action.payload.file,
          },
        },
      }
    case 'AUDIO_FILE_DECODE_ERROR':
      return {
        ...state,
        decodeErrors: {
          ...state.decodeErrors,
          [action.payload.id]: action.payload.error,
        },
        decodingIds: without([action.payload.id], state.decodingIds),
      }
    default:
      return state
  }
}

export default audioFilesReducer
