import {
  CONNECTION_ADD,
  CONNECTION_REMOVE,
  CONNECTION_REMOVE_ALL_FOR_ID,
} from './actionTypes'

export const addConnectionAction = (fromId, toId) => ({
  type: CONNECTION_ADD,
  payload: { fromId, toId },
})

export const removeConnectionAction = (fromId, toId) => ({
  type: CONNECTION_REMOVE,
  payload: { fromId, toId },
})

export const removeAllConnectionsForIdAction = id => ({
  type: CONNECTION_REMOVE_ALL_FOR_ID,
  payload: { id },
})
