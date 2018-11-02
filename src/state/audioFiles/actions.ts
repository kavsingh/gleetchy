import { head, omit } from 'ramda'
import { Dispatch } from 'redux'

import { decodeAudioData } from '~/apis/audio'
import {
  DecodedAudioFileData,
  loadAudioFilesToArrayBuffers,
  readFileToArrayBuffer,
} from '~/apis/file'
import {
  AudioFileDecodeCompleteAction,
  AudioFileDecodeErrorAction,
  AudioFileDecodeStartAction,
  AudioFileLoadCompleteAction,
  AudioFileLoadErrorAction,
  AudioFileLoadStartAction,
} from './types'

const decodeFileBuffer = async (
  dispatch: Dispatch,
  id: string,
  file: { buffer: ArrayBuffer },
) => {
  try {
    dispatch<AudioFileDecodeStartAction>({
      payload: { id },
      type: 'AUDIO_FILE_DECODE_START',
    })

    const audioBuffer = await decodeAudioData(file.buffer)

    dispatch<AudioFileDecodeCompleteAction>({
      payload: { id, file: { ...omit(['buffer'], file), audioBuffer } },
      type: 'AUDIO_FILE_DECODE_COMPLETE',
    })
  } catch (error) {
    dispatch<AudioFileDecodeErrorAction>({
      payload: { id, error },
      type: 'AUDIO_FILE_DECODE_ERROR',
    })
  }
}

export const selectAudioFileAction = (id: string) => async (
  dispatch: Dispatch,
) => {
  dispatch<AudioFileLoadStartAction>({
    payload: { id },
    type: 'AUDIO_FILE_LOAD_START',
  })

  let file: DecodedAudioFileData | undefined

  try {
    file = head(await loadAudioFilesToArrayBuffers())

    if (!file) {
      throw new Error('No file loaded')
    }

    dispatch<AudioFileLoadCompleteAction>({
      payload: { id, file },
      type: 'AUDIO_FILE_LOAD_COMPLETE',
    })

    decodeFileBuffer(dispatch, id, file)
  } catch (error) {
    dispatch<AudioFileLoadErrorAction>({
      payload: { id, error },
      type: 'AUDIO_FILE_LOAD_ERROR',
    })
  }
}

export const receiveAudioFileAction = (id: string, file: File) => async (
  dispatch: Dispatch,
) => {
  dispatch<AudioFileLoadStartAction>({
    payload: { id },
    type: 'AUDIO_FILE_LOAD_START',
  })

  let fileData: DecodedAudioFileData | undefined

  try {
    fileData = await readFileToArrayBuffer(file)

    dispatch<AudioFileLoadCompleteAction>({
      payload: { id, file: fileData },
      type: 'AUDIO_FILE_LOAD_COMPLETE',
    })

    decodeFileBuffer(dispatch, id, fileData)
  } catch (error) {
    dispatch<AudioFileLoadErrorAction>({
      payload: { id, error },
      type: 'AUDIO_FILE_LOAD_ERROR',
    })
  }
}
