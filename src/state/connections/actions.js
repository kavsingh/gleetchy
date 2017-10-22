import { isSameConnection } from '../../util/audio'
import { CONNECTION_ADD, CONNECTION_REMOVE } from './actionTypes'
import { connectionsSelector } from './selectors'

export const addConnectionAction = (fromId, toId) => ({
  type: CONNECTION_ADD,
  payload: { fromId, toId },
})

export const removeConnectionAction = (fromId, toId) => ({
  type: CONNECTION_REMOVE,
  payload: { fromId, toId },
})

export const toggleConnectionAction = (fromId, toId) => (
  dispatch,
  getState,
) => {
  const connections = connectionsSelector(getState())
  const existing = connections.find(
    isSameConnection({ from: fromId, to: toId }),
  )

  if (existing) dispatch(removeConnectionAction(fromId, toId))
  else dispatch(addConnectionAction(fromId, toId))
}
