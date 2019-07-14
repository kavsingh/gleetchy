import { curry, F, propEq, propSatisfies, test, tryCatch } from 'ramda'

import { AudioNodeConnection, AudioNodeMeta } from '~/types'

const typeSatisfies = (pred: (type: string) => boolean) =>
  tryCatch(propSatisfies<string>(pred, 'type'), F)

/* eslint-disable jest/no-disabled-tests */
export const isAudioEffect = typeSatisfies(test(/^audio_effect_/i))

export const isInstrument = typeSatisfies(test(/^instrument_/i))
/* eslint-enable */

type Connection = Omit<AudioNodeConnection, 'color'>

export const isSameConnection = curry(
  (connection1: Connection, connection2: Connection) =>
    connection1.from === connection2.from && connection1.to === connection2.to,
)

export const getConnectionsFor = curry(
  (id: string, connections: AudioNodeConnection[]): AudioNodeConnection[] =>
    connections.filter(({ from, to }) => from === id || to === id),
)

export const hasDownstreamConnectionTo = curry(
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
  ) => fromId !== toId && !hasDownstreamConnectionTo(connections, toId, fromId),
)

export const getConnectionBetween = curry(
  (
    connections: AudioNodeConnection[],
    { id: from }: Pick<AudioNodeMeta, 'id'>,
    { id: to }: Pick<AudioNodeMeta, 'id'>,
  ) => connections.find(isSameConnection({ from, to })),
)
