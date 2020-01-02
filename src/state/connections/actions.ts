import { Dispatch } from 'redux'

import { ApplicationState } from '~/state/configure-store'
import { isSameConnection } from '~/util/audio'

import { connectionsSelector } from './selectors'
import { ConnectionAddAction, ConnectionRemoveAction } from './types'

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

export const toggleConnectionAction = (fromId: string, toId: string) => (
  dispatch: Dispatch,
  getState: () => ApplicationState,
) => {
  const connections = connectionsSelector(getState())
  const existing = connections.find(
    isSameConnection({ from: fromId, to: toId }),
  )

  if (existing) {
    dispatch<ConnectionRemoveAction>(removeConnectionAction(fromId, toId))
  } else {
    dispatch<ConnectionAddAction>(addConnectionAction(fromId, toId))
  }
}
