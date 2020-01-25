import { createSelector } from 'reselect'

import { createValueEqSelector } from './selector'

describe('custom state selectors', () => {
  // Check assumptions for default createSelector
  describe('default createSelector sanity check', () => {
    it('results in new value on ref changes despite equal values', () => {
      let baseState = { a: { b: [1, 2] } }
      const aSelector = (state: typeof baseState) => state.a

      const defaultBSelector = createSelector(aSelector, a => a.b)
      const defaultVal1 = defaultBSelector(baseState)

      expect(defaultVal1).toEqual([1, 2])

      baseState = { a: { b: [1, 2] } }

      expect(defaultBSelector(baseState)).not.toBe(defaultVal1)
      expect(defaultBSelector(baseState)).toEqual(defaultVal1)
    })
  })

  describe('createValueEqSelector', () => {
    it('only results in new value if state value has changed', () => {
      let baseState = { a: { b: [1, 2] } }
      const aSelector = (state: typeof baseState) => state.a

      const defaultBSelector = createValueEqSelector(aSelector, a => a.b)
      const defaultVal1 = defaultBSelector(baseState)

      expect(defaultVal1).toEqual([1, 2])

      baseState = { a: { b: [1, 2] } }

      expect(defaultBSelector(baseState)).toBe(defaultVal1)

      baseState = { a: { b: [2, 1] } }

      expect(defaultBSelector(baseState)).not.toBe(defaultVal1)
    })
  })
})
