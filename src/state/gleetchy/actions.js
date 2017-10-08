import { curry, head, equals } from 'ramda'
import {
  readFileToArrayBuffer,
  loadAudioFilesToArrayBuffers,
} from '../../apis/file'
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
  CONNECTION_ADD,
  CONNECTION_REMOVE,
} from './actionTypes'
import { connectionsSelector } from './selectors'

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

export const looperSelectAudioFile = id => async dispatch => {
  dispatch({ type: LOOPER_LOAD_FILE_START, payload: { id } })

  try {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: LOOPER_LOAD_FILE_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: LOOPER_LOAD_FILE_ERROR, payload: { id, error } })
  }
}

export const looperReceiveAudioFile = (id, file) => async dispatch => {
  dispatch({ type: LOOPER_LOAD_FILE_START, payload: { id } })

  try {
    const withBuffer = await readFileToArrayBuffer(file)

    dispatch({
      type: LOOPER_LOAD_FILE_COMPLETE,
      payload: { id, file: withBuffer },
    })
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

export const connectionAdd = (fromId, toId) => ({
  type: CONNECTION_ADD,
  payload: { connection: [fromId, toId] },
})

export const connectionRemove = (fromId, toId) => ({
  type: CONNECTION_REMOVE,
  payload: { connection: [fromId, toId] },
})

export const connectionToggle = (fromId, toId) => (dispatch, getState) => {
  const connections = connectionsSelector(getState())
  const current = connections.find(equals([fromId, toId]))

  if (current) dispatch(connectionRemove(fromId, toId))
  else dispatch(connectionAdd(fromId, toId))
}

export const engineEventsClear = () => ({ type: ENGINE_EVENTS_CLEAR })
