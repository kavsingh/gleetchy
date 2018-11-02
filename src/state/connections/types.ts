import { ActionWithPayload } from '~/types'

export interface ConnectionDescriptor {
  fromId: string
  toId: string
}

export type ConnectionAddAction = ActionWithPayload<
  'CONNECTION_ADD',
  ConnectionDescriptor
>

export type ConnectionRemoveAction = ActionWithPayload<
  'CONNECTION_REMOVE',
  ConnectionDescriptor
>

export type ConnectionsAction = ConnectionAddAction | ConnectionRemoveAction
