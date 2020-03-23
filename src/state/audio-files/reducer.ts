import { Reducer } from 'redux'
import { produce } from 'immer'

import { AudioFileData, DecodedAudioFileData } from '~/types'
import { stableOmit, stableWithout, stableAppendUnique } from '~/lib/util'

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

export const audioFilesReducer: Reducer<AudioFilesState, AudioFilesAction> = (
  state = defaultState,
  action,
) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'AUDIO_FILE_LOAD_START': {
        const { id } = action.payload

        draftState.loadErrors = stableOmit([id], draftState.loadErrors)
        draftState.loadingIds = stableAppendUnique([id], draftState.loadingIds)

        break
      }
      case 'AUDIO_FILE_LOAD_COMPLETE': {
        const { id, file } = action.payload

        draftState.loadErrors = stableOmit([id], draftState.loadErrors)
        draftState.loadingIds = stableWithout([id], draftState.loadingIds)

        const fileData = stableOmit(['buffer'], file)
        const currFile = draftState.files[id]

        if (currFile) Object.assign(currFile, fileData)
        else draftState.files[id] = fileData

        break
      }
      case 'AUDIO_FILE_LOAD_ERROR': {
        const { id, error } = action.payload

        draftState.loadingIds = stableWithout([id], draftState.loadingIds)
        draftState.loadErrors[id] = error

        break
      }
      case 'AUDIO_FILE_DECODE_START': {
        const { id } = action.payload

        draftState.decodeErrors = stableOmit([id], draftState.decodeErrors)
        draftState.decodingIds = stableAppendUnique(
          [id],
          draftState.decodingIds,
        )

        break
      }
      case 'AUDIO_FILE_DECODE_COMPLETE': {
        const { id, file } = action.payload

        draftState.decodeErrors = stableOmit([id], draftState.decodeErrors)
        draftState.decodingIds = stableWithout([id], draftState.decodingIds)

        const currFile = draftState.files[id]

        if (currFile) Object.assign(currFile, file)
        else draftState.files[id] = { ...file }

        break
      }
      case 'AUDIO_FILE_DECODE_ERROR': {
        const { id, error } = action.payload

        draftState.decodeErrors[id] = error
        draftState.decodingIds = stableWithout([id], draftState.decodingIds)

        break
      }
      default:
        break
    }
  })
