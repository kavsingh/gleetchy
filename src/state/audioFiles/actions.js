import { head } from 'ramda'
import {
  readFileToArrayBuffer,
  loadAudioFilesToArrayBuffers,
} from '../../apis/file'
import {
  AUDIO_FILE_LOAD_START,
  AUDIO_FILE_LOAD_COMPLETE,
  AUDIO_FILE_LOAD_ERROR,
} from './actionTypes'

export const selectAudioFileAction = id => async dispatch => {
  dispatch({ type: AUDIO_FILE_LOAD_START, payload: { id } })

  try {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: AUDIO_FILE_LOAD_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: AUDIO_FILE_LOAD_ERROR, payload: { id, error } })
  }
}

export const receiveAudioFileAction = (id, file) => async dispatch => {
  dispatch({ type: AUDIO_FILE_LOAD_START, payload: { id } })

  try {
    const withBuffer = await readFileToArrayBuffer(file)

    dispatch({
      type: AUDIO_FILE_LOAD_COMPLETE,
      payload: { id, file: withBuffer },
    })
  } catch (error) {
    dispatch({ type: AUDIO_FILE_LOAD_ERROR, payload: { id, error } })
  }
}
