import type {
  ConnectionAddAction,
  ConnectionRemoveAction,
  ConnectionToggleAction,
} from './types'

export const addConnectionAction = (
  fromId: string,
  toId: string,
): ConnectionAddAction => ({
  payload: { fromId, toId },
  type: 'CONNECTION_ADD',
})

export const removeConnectionAction = (
  fromId: string,
  toId: string,
): ConnectionRemoveAction => ({
  payload: { fromId, toId },
  type: 'CONNECTION_REMOVE',
})

export const toggleConnectionAction = (
  fromId: string,
  toId: string,
): ConnectionToggleAction => ({
  payload: { fromId, toId },
  type: 'CONNECTION_TOGGLE',
})
