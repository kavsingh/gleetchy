import { head } from 'ramda'
import { loadAudioFilesToArrayBuffers } from '../../apis/file'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_START,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
} from './actionTypes'

export const playbackStart = () => ({
  type: PLAYBACK_START,
})

export const playbackStop = () => ({
  type: PLAYBACK_STOP,
})

export const looperUpdateProps = (id, props) => ({
  type: LOOPER_UPDATE_PROPS,
  payload: props,
})

export const looperLoadFile = id => async dispatch => {
  dispatch({ type: LOOPER_LOAD_FILE_START })

  try {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: LOOPER_LOAD_FILE_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: LOOPER_LOAD_FILE_ERROR, payload: { id, error } })
  }
}
