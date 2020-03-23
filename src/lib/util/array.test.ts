import { stableWithout, stableFilter, stableAppendUnique } from './array'

describe('util/array', () => {
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

  describe('stableFilter', () => {
    it('returns same array if nothing to remove', () => {
      const initialArray = [1, 2, 3]
      const result = stableFilter((item) => item !== 5, initialArray)

      expect(result).toEqual([1, 2, 3])
      expect(result).toBe(initialArray)
    })

    it('returns new array if items to remove', () => {
      const initialArray = [1, 2, 3, 3]
      const withoutItems = stableFilter((item) => item !== 3 && item !== 1)
      const result = withoutItems(initialArray)

      expect(result).toEqual([2])
      expect(result).not.toBe(initialArray)
    })
  })

  describe('stableAppendUnique', () => {
    it('does nothing if item is already unique and last in array', () => {
      const initialArray = [1, 2, 3]
      const result = stableAppendUnique([2, 3], initialArray)

      expect(result).toEqual([1, 2, 3])
      expect(result).toBe(initialArray)
    })

    it('removes others and returns new array if item is last but not unique', () => {
      const initialArray = [1, 3, 2, 3]
      const result = stableAppendUnique([3], initialArray)

      expect(result).toEqual([1, 2, 3])
      expect(result).not.toBe(initialArray)
    })

    it('removes other instances and appends to end of new array', () => {
      const initialArray = [2, 1, 2, 3]
      const appendItems = stableAppendUnique([2, 1, 'c'])
      const result = appendItems(initialArray)

      expect(result).toEqual([3, 2, 1, 'c'])
      expect(result).not.toBe(initialArray)
    })
  })
})
