import { identity } from 'ramda'
import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configure-store'

const connectionsStateSelector = (state: ApplicationState) => state.connections

export const connectionsSelector = createSelector(
  connectionsStateSelector,
  identity,
)
