import { identity } from 'ramda'
import { createSelector } from 'reselect'

const fxStateSelector = state => state.fx

export const fxSelector = createSelector(fxStateSelector, identity)
