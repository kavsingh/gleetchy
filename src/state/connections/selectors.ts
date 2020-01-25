import { identity } from 'ramda'

import { ApplicationState } from '~/state/configure-store'

import { createValueEqSelector } from '../lib/selector'

const connectionsStateSelector = (state: ApplicationState) => state.connections

export const connectionsSelector = createValueEqSelector(
  connectionsStateSelector,
  identity,
)
