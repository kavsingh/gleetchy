import { decodeAudioDataP } from '../../util/audio'

import {
  ENGINE_EVENTS_ADD,
  ENGINE_EVENTS_CLEAR,
  ENGINE_DECODE_ARRAY_BUFFER_START,
  ENGINE_DECODE_ARRAY_BUFFER_COMPLETE,
  ENGINE_DECODE_ARRAY_BUFFER_ERROR,
} from './actionTypes'

export const addEngineEventsAction = events => ({
  type: ENGINE_EVENTS_ADD,
  payload: { events },
})

export const clearEngineEventsAction = () => ({ type: ENGINE_EVENTS_CLEAR })

export const decodeAudioDataAction = (
  audioContext,
  id,
  arrayBuffer,
) => async dispatch => {
  dispatch({ type: ENGINE_DECODE_ARRAY_BUFFER_START, payload: { id } })

  try {
    if (!arrayBuffer) throw new Error(`No array buffer`)

    const audioBuffer = await decodeAudioDataP(audioContext, arrayBuffer)

    dispatch({
      type: ENGINE_DECODE_ARRAY_BUFFER_COMPLETE,
      payload: { id, audioBuffer },
    })
  } catch (error) {
    dispatch({
      type: ENGINE_DECODE_ARRAY_BUFFER_ERROR,
      payload: { id, error },
    })
  }
}
