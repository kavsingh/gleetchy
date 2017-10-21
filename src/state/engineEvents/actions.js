import { ENGINE_EVENTS_ADD, ENGINE_EVENTS_CLEAR } from './actionTypes'

export const addEngineEventsAction = events => ({
  type: ENGINE_EVENTS_ADD,
  payload: { events },
})

export const clearEngineEventsAction = () => ({ type: ENGINE_EVENTS_CLEAR })
