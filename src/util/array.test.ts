import { stableWithout } from './array'

describe('Array util', () => {
  describe('stableWithout', () => {
    it('returns same array if nothing to remove', () => {
      const initialArray = [1, 2, 3]
      const result = stableWithout([5, 6], initialArray)

      expect(result).toEqual([1, 2, 3])
      expect(result).toBe(initialArray)
    })

    it('returns new array if items to remove', () => {
      const initialArray = [1, 2, 3, 3]
      const withoutItems = stableWithout([1, 3, 'q'])
      const result = withoutItems(initialArray)

      expect(result).toEqual([2])
      expect(result).not.toBe(initialArray)
    })
  })
})
