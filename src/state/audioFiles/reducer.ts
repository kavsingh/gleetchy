import { Reducer } from 'redux'
import produce from 'immer'
import { omit } from 'ramda'

import { AudioFileData, DecodedAudioFileData } from '~/types'
import { mutOmit } from '~/util/object'
import { mutWithout } from '~/util/array'

import { AudioFilesAction } from './types'

interface StoredAudioFileData extends Omit<AudioFileData, 'buffer'> {
  buffer?: DecodedAudioFileData['audioBuffer']
}

export interface AudioFilesState {
  decodeErrors: { [key: string]: Error }
  decodingIds: string[]
  files: { [key: string]: StoredAudioFileData }
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
) =>
  produce(state, draftState => {
    switch (action.type) {
      case 'AUDIO_FILE_LOAD_START': {
        mutOmit([action.payload.id], draftState.loadErrors)
        mutWithout([action.payload.id], draftState.loadingIds)

        draftState.loadingIds.push(action.payload.id)

        break
      }
      case 'AUDIO_FILE_LOAD_COMPLETE': {
        mutOmit([action.payload.id], draftState.loadErrors)
        mutWithout([action.payload.id], draftState.loadingIds)

        const fileData = omit(['buffer'], action.payload.file)
        const currFile = draftState.files[action.payload.id]

        if (currFile) Object.assign(currFile, fileData)
        else draftState.files[action.payload.id] = fileData

        break
      }
      case 'AUDIO_FILE_LOAD_ERROR':
        mutWithout([action.payload.id], draftState.loadingIds)

        draftState.loadErrors[action.payload.id] = action.payload.error

        break
      case 'AUDIO_FILE_DECODE_START':
        mutOmit([action.payload.id], state.decodeErrors)
        mutWithout([action.payload.id], state.decodingIds)

        state.decodingIds.push(action.payload.id)

        break
      case 'AUDIO_FILE_DECODE_COMPLETE': {
        mutOmit([action.payload.id], state.decodeErrors)
        mutWithout([action.payload.id], state.decodingIds)

        const currFile = draftState.files[action.payload.id]

        if (currFile) Object.assign(currFile, action.payload.file)
        else draftState.files[action.payload.id] = { ...action.payload.file }

        break
      }
      case 'AUDIO_FILE_DECODE_ERROR':
        mutWithout([action.payload.id], draftState.decodingIds)

        draftState.decodeErrors[action.payload.id] = action.payload.error

        break
      default:
        break
    }
  })

export default audioFilesReducer
