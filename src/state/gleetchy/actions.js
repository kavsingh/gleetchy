import { curry, head, equals } from 'ramda'
import {
  readFileToArrayBuffer,
  loadAudioFilesToArrayBuffers,
} from '../../apis/file'
import { sendJsonString, consumeJsonString } from '../../apis/state'
import { warn } from '../../util'
import { decodeAudioDataP } from '../../util/audio'
import { INS_LOOP } from '../../constants/nodeTypes'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  ENGINE_EVENTS_CLEAR,
  NODE_ADD,
  NODE_UPDATE_LABEL,
  NODE_UPDATE_PROPS,
  LOOP_LOAD_FILE_START,
  LOOP_LOAD_FILE_COMPLETE,
  LOOP_LOAD_FILE_DECODE_START,
  LOOP_LOAD_FILE_DECODE_COMPLETE,
  LOOP_LOAD_FILE_ERROR,
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  STATE_REPLACE,
} from './actionTypes'
import { connectionsSelector } from './selectors'
import { serialize, deserialize } from '../serialization'

export const playbackStart = () => ({
  type: PLAYBACK_START,
})

export const playbackStop = () => ({
  type: PLAYBACK_STOP,
})

export const playbackToggle = () => (dispatch, getState) => {
  dispatch(getState().gleetchy.isPlaying ? playbackStop() : playbackStart())
}

export const nodeUpdateProps = (id, props) => ({
  type: NODE_UPDATE_PROPS,
  payload: { id, props },
})

export const nodeUpdateLabel = (id, label) => ({
  type: NODE_UPDATE_LABEL,
  payload: { id, label },
})

export const loopSelectAudioFile = id => async dispatch => {
  dispatch({ type: LOOP_LOAD_FILE_START, payload: { id } })

  try {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file loaded')

    dispatch({ type: LOOP_LOAD_FILE_COMPLETE, payload: { id, file } })
  } catch (error) {
    dispatch({ type: LOOP_LOAD_FILE_ERROR, payload: { id, error } })
  }
}

export const loopReceiveAudioFile = (id, file) => async dispatch => {
  dispatch({ type: LOOP_LOAD_FILE_START, payload: { id } })

  try {
    const withBuffer = await readFileToArrayBuffer(file)

    dispatch({
      type: LOOP_LOAD_FILE_COMPLETE,
      payload: { id, file: withBuffer },
    })
  } catch (error) {
    dispatch({ type: LOOP_LOAD_FILE_ERROR, payload: { id, error } })
  }
}

export const loopLoadFileDecode = curry(
  (audioContext, id, { buffer, fileName, fileType } = {}) => async dispatch => {
    dispatch({ type: LOOP_LOAD_FILE_DECODE_START, payload: { id } })

    try {
      if (!buffer) throw new Error(`No buffer for ${fileName}`)

      const audioBuffer = await decodeAudioDataP(audioContext, buffer)

      dispatch({
        type: LOOP_LOAD_FILE_DECODE_COMPLETE,
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
        type: LOOP_LOAD_FILE_ERROR,
        payload: { id, error },
      })
    }
  },
)

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

export const stateExport = () => (dispatch, getState) => {
  sendJsonString(serialize(getState()))
}

export const stateConsume = () => dispatch => {
  dispatch(playbackStop())

  consumeJsonString()
    .then(deserialize)
    .then(nextState =>
      dispatch({ type: STATE_REPLACE, payload: { nextState } }),
    )
    .catch(warn)
}

export const loopAdd = () => ({
  type: NODE_ADD,
  payload: { type: INS_LOOP },
})

export const engineEventsClear = () => ({ type: ENGINE_EVENTS_CLEAR })
