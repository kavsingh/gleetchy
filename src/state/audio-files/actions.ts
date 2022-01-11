import { head, pick } from 'ramda'

import {
  loadAudioFilesToArrayBuffers,
  readFileToArrayBuffer,
} from '~/apis/file'
import { getAudioContext } from '~/apis/audio'

import type { Dispatch } from 'redux'
import type { AudioFileData } from '~/types'
import type {
  AudioFileDecodeCompleteAction,
  AudioFileDecodeErrorAction,
  AudioFileDecodeStartAction,
  AudioFileLoadCompleteAction,
  AudioFileLoadErrorAction,
  AudioFileLoadStartAction,
} from './types'

export const selectAudioFileAction =
  (id: string) => async (dispatch: Dispatch) => {
    dispatch<AudioFileLoadStartAction>({
      payload: { id },
      type: 'AUDIO_FILE_LOAD_START',
    })

    let file: AudioFileData | undefined

    try {
      file = head(await loadAudioFilesToArrayBuffers())

      if (!file) throw new Error('No file loaded')

      dispatch<AudioFileLoadCompleteAction>({
        payload: { id, file },
        type: 'AUDIO_FILE_LOAD_COMPLETE',
      })
    } catch (e) {
      dispatch<AudioFileLoadErrorAction>({
        payload: { id, error: errorFrom(e) },
        type: 'AUDIO_FILE_LOAD_ERROR',
      })
    }

    if (file) void decodeFileBuffer(dispatch, id, file)
  }

export const receiveAudioFileAction =
  (id: string, file: File) => async (dispatch: Dispatch) => {
    dispatch<AudioFileLoadStartAction>({
      payload: { id },
      type: 'AUDIO_FILE_LOAD_START',
    })

    let fileData: AudioFileData | undefined

    try {
      fileData = await readFileToArrayBuffer(file)

      dispatch<AudioFileLoadCompleteAction>({
        payload: { id, file: fileData },
        type: 'AUDIO_FILE_LOAD_COMPLETE',
      })
    } catch (e) {
      dispatch<AudioFileLoadErrorAction>({
        payload: { id, error: errorFrom(e) },
        type: 'AUDIO_FILE_LOAD_ERROR',
      })
    }

    if (fileData) void decodeFileBuffer(dispatch, id, fileData)
  }

const decodeFileBuffer = async (
  dispatch: Dispatch,
  id: string,
  file: AudioFileData,
) => {
  dispatch<AudioFileDecodeStartAction>({
    payload: { id },
    type: 'AUDIO_FILE_DECODE_START',
  })

  try {
    const audioBuffer = await getAudioContext().decodeAudioData(file.buffer)

    dispatch<AudioFileDecodeCompleteAction>({
      payload: {
        file: { ...pick(['fileName', 'fileType'], file), audioBuffer },
        id,
      },
      type: 'AUDIO_FILE_DECODE_COMPLETE',
    })
  } catch (e) {
    dispatch<AudioFileDecodeErrorAction>({
      payload: { id, error: errorFrom(e) },
      type: 'AUDIO_FILE_DECODE_ERROR',
    })
  }
}

const errorFrom = (value: unknown) =>
  value instanceof Error ? value : new Error(String(value))
