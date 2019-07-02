import {
  curry,
  equals,
  F,
  prop,
  propEq,
  propSatisfies,
  sortBy,
  startsWith,
  tryCatch,
} from 'ramda'

import { AudioNodeConnection } from '~/types'

const typeSatisfies = (pred: (type: string) => boolean) =>
  tryCatch(propSatisfies<string>(pred, 'type'), F)

export const isEffect = typeSatisfies(startsWith('AUDIO_EFFECT_'))
export const isInstrument = typeSatisfies(startsWith('INSTRUMENT_'))
export const isMainOut = typeSatisfies(equals('AUDIO_CONTEXT'))

export const sortByType = sortBy<{ type: string }>(prop('type'))

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
  (toId: string, connections: AudioNodeConnection[], fromId: string) => {
    if (!connections.length) {
      return false
    }

    const checkDownstreamConnection = (innerFromId: string): boolean => {
      const connectionsFromId = connections.filter(propEq('from', innerFromId))

      if (!connectionsFromId.length) {
        return false
      }

      if (connectionsFromId.some(propEq('to', toId))) {
        return true
      }

      return connectionsFromId.reduce(
        (accum: boolean, connection) =>
          accum || checkDownstreamConnection(connection.to),
        false,
      )
    }

    return checkDownstreamConnection(fromId)
  },
)
