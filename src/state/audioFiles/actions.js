import { head, omit } from 'ramda'
import {
  readFileToArrayBuffer,
  loadAudioFilesToArrayBuffers,
} from '../../apis/file'
import { decodeAudioData } from '../../apis/audio'
import {
  AUDIO_FILE_LOAD_START,
  AUDIO_FILE_LOAD_COMPLETE,
  AUDIO_FILE_LOAD_ERROR,
  AUDIO_FILE_DECODE_START,
  AUDIO_FILE_DECODE_COMPLETE,
  AUDIO_FILE_DECODE_ERROR,
} from './actionTypes'

const decodeFileBuffer = async (dispatch, id, file) => {
  try {
    dispatch({ type: AUDIO_FILE_DECODE_START, payload: { id } })

    const audioBuffer = await decodeAudioData(file.buffer)

    dispatch({
      type: AUDIO_FILE_DECODE_COMPLETE,
      payload: { id, file: { ...omit(['buffer'], file), audioBuffer } },
    })
  } catch (error) {
    dispatch({ type: AUDIO_FILE_DECODE_ERROR, payload: { id, error } })
  }
}

export const selectAudioFileAction = id => async dispatch => {
  dispatch({ type: AUDIO_FILE_LOAD_START, payload: { id } })

  let file

  try {
    file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: AUDIO_FILE_LOAD_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: AUDIO_FILE_LOAD_ERROR, payload: { id, error } })
  }

  decodeFileBuffer(dispatch, id, file)
}

export const receiveAudioFileAction = (id, file) => async dispatch => {
  dispatch({ type: AUDIO_FILE_LOAD_START, payload: { id } })

  let fileData

  try {
    fileData = await readFileToArrayBuffer(file)

    dispatch({
      type: AUDIO_FILE_LOAD_COMPLETE,
      payload: { id, file: fileData },
    })
  } catch (error) {
    dispatch({ type: AUDIO_FILE_LOAD_ERROR, payload: { id, error } })
  }

  decodeFileBuffer(dispatch, id, fileData)
}
