import { curry, head } from 'ramda'
import { loadAudioFilesToArrayBuffers } from '../../apis/file'
import { decodeAudioDataP } from '../../util/audio'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  ENGINE_EVENTS_CLEAR,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_START,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_START,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
  DELAY_UPDATE_PROPS,
  REVERB_UPDATE_PROPS,
} from './actionTypes'

export const playbackStart = () => ({
  type: PLAYBACK_START,
})

export const playbackStop = () => ({
  type: PLAYBACK_STOP,
})

export const playbackToggle = () => (dispatch, getState) => {
  dispatch(getState().gleetchy.isPlaying ? playbackStop() : playbackStart())
}

export const looperUpdateProps = (id, props) => ({
  type: LOOPER_UPDATE_PROPS,
  payload: { id, props },
})

export const looperLoadFile = id => async dispatch => {
  dispatch({ type: LOOPER_LOAD_FILE_START, payload: { id } })

  try {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: LOOPER_LOAD_FILE_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: LOOPER_LOAD_FILE_ERROR, payload: { id, error } })
  }
}

export const looperLoadFileDecode = curry(
  (audioContext, id, { buffer, fileName, fileType } = {}) => async dispatch => {
    dispatch({ type: LOOPER_LOAD_FILE_DECODE_START, payload: { id } })

    try {
      if (!buffer) throw new Error(`No buffer for ${fileName}`)

      const audioBuffer = await decodeAudioDataP(audioContext, buffer)

      dispatch({
        type: LOOPER_LOAD_FILE_DECODE_COMPLETE,
        payload: {
          id,
          props: {
            audioBuffer,
            fileName,
            fileType,
          },
        },
      })
    } catch (error) {
      dispatch({
        type: LOOPER_LOAD_FILE_ERROR,
        payload: { id, error },
      })
    }
  },
)

export const delayUpdateProps = props => ({
  type: DELAY_UPDATE_PROPS,
  payload: { props },
})

export const reverbUpdateProps = props => ({
  type: REVERB_UPDATE_PROPS,
  payload: { props },
})

export const engineEventsClear = () => ({ type: ENGINE_EVENTS_CLEAR })
