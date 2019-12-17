import { isNotNil, mutOmit } from './object'

describe('Object util', () => {
  describe('isNotNil', () => {
    it('determines if value is not nil', () => {
      expect(isNotNil(undefined)).toBe(false)
      expect(isNotNil(null)).toBe(false)
      expect(isNotNil(0)).toBe(true)
      expect(isNotNil({})).toBe(true)
      expect(isNotNil([])).toBe(true)
      expect(isNotNil(NaN)).toBe(true)
    })
  })

  describe('mutOmit', () => {
    it('mutably omits keys from passed in object', () => {
      const removeAandC = mutOmit(['a', 'c'])
      const obj = { a: 1, b: 2, c: 3, d: 4 }

      removeAandC(obj)

      expect(obj).toEqual({ b: 2, d: 4 })

      removeAandC(obj)

      expect(obj).toEqual({ b: 2, d: 4 })
    })
  })
})
