import { always } from 'ramda'

// Ramda doesn't include this but it does have utility
// see: https://github.com/ramda/ramda/issues/701
export const noop = always(undefined)
