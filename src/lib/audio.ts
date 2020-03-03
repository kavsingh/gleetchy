import { curry, propEq, test } from 'ramda'

import {
  AudioNodeConnection,
  AudioNodeMeta,
  GAudioNode,
  GInstrumentNode,
} from '~/types'

export const hasAudioEffectType = <T extends { type?: string }>(item: T) =>
  test(/^audio_effect_/i, item.type || '')

export const hasInstrumentType = <T extends { type?: string }>(item: T) =>
  test(/^instrument_/i, item.type || '')

export const isAudioEffectNode = (
  node: GAudioNode | GInstrumentNode | AudioNode,
): node is GAudioNode => hasAudioEffectType(node as GAudioNode)

export const isInstrumentNode = (
  node: GAudioNode | GInstrumentNode | AudioNode,
): node is GInstrumentNode => hasInstrumentType(node as GAudioNode)

type Connection = Omit<AudioNodeConnection, 'color'>

export const isSameConnection = curry(
  (connection1: Connection, connection2: Connection) =>
    connection1.from === connection2.from && connection1.to === connection2.to,
)

export const getConnectionsFor = curry(
  (id: string, connections: AudioNodeConnection[]): AudioNodeConnection[] =>
    connections.filter(({ from, to }) => from === id || to === id),
)

export const hasConnectionTo = curry(
  (connections: Connection[], toId: string, fromId: string) => {
    if (!connections.length) return false

    const checkDownstreamConnection = (innerFromId: string): boolean => {
      const connectionsFromId = connections.filter(propEq('from', innerFromId))

      if (!connectionsFromId.length) return false
      if (connectionsFromId.some(propEq('to', toId))) return true

      return connectionsFromId.reduce(
        (accum: boolean, connection) =>
          accum || checkDownstreamConnection(connection.to),
        false,
      )
    }

    return checkDownstreamConnection(fromId)
  },
)

export const canConnectNodes = curry(
  (
    connections: Connection[],
    { id: fromId }: Pick<AudioNodeMeta, 'id'>,
    { id: toId }: Pick<AudioNodeMeta, 'id'>,
  ) => fromId !== toId && !hasConnectionTo(connections, fromId, toId),
)

export const getConnectionBetween = curry(
  (
    connections: AudioNodeConnection[],
    { id: from }: Pick<AudioNodeMeta, 'id'>,
    { id: to }: Pick<AudioNodeMeta, 'id'>,
  ) => connections.find(isSameConnection({ from, to })),
)
