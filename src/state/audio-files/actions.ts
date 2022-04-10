import { head, pick } from 'ramda'

import {
  loadAudioFilesToArrayBuffers,
  readFileToArrayBuffer,
} from '~/apis/file'
import { getAudioContext } from '~/apis/audio'

import type { AudioFileData } from '~/types'
import type { AppDispatch, AppThunkAction } from '../configure-store'

export const selectAudioFileAction =
  (id: string): AppThunkAction =>
  async (dispatch) => {
    dispatch({ type: 'AUDIO_FILE_LOAD_START', payload: { id } })

    let file: AudioFileData | undefined

    try {
      file = head(await loadAudioFilesToArrayBuffers())

      if (!file) throw new Error('No file loaded')

      dispatch({
        type: 'AUDIO_FILE_LOAD_COMPLETE',
        payload: { id, file },
      })
    } catch (e) {
      dispatch({
        type: 'AUDIO_FILE_LOAD_ERROR',
        payload: { id, error: errorFrom(e) },
      })
    }

    if (file) void decodeFileBuffer(dispatch, id, file)
  }

export const receiveAudioFileAction =
  (id: string, file: File): AppThunkAction =>
  async (dispatch) => {
    dispatch({ type: 'AUDIO_FILE_LOAD_START', payload: { id } })

    let fileData: AudioFileData | undefined

    try {
      fileData = await readFileToArrayBuffer(file)

      dispatch({
        type: 'AUDIO_FILE_LOAD_COMPLETE',
        payload: { id, file: fileData },
      })
    } catch (e) {
      dispatch({
        type: 'AUDIO_FILE_LOAD_ERROR',
        payload: { id, error: errorFrom(e) },
      })
    }

    if (fileData) void decodeFileBuffer(dispatch, id, fileData)
  }

const decodeFileBuffer = async (
  dispatch: AppDispatch,
  id: string,
  file: AudioFileData,
) => {
  dispatch({ type: 'AUDIO_FILE_DECODE_START', payload: { id } })

  try {
    const audioBuffer = await getAudioContext().decodeAudioData(file.buffer)

    dispatch({
      type: 'AUDIO_FILE_DECODE_COMPLETE',
      payload: {
        id,
        file: { ...pick(['fileName', 'fileType'], file), audioBuffer },
      },
    })
  } catch (e) {
    dispatch({
      type: 'AUDIO_FILE_DECODE_ERROR',
      payload: { id, error: errorFrom(e) },
    })
  }
}

const errorFrom = (value: unknown) =>
  value instanceof Error ? value : new Error(String(value))
