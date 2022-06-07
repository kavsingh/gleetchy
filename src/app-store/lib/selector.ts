import { createSelectorCreator, defaultMemoize } from 'reselect'
import { equals } from 'ramda'

export const createValueEqSelector = createSelectorCreator(
  defaultMemoize,
  equals,
)
