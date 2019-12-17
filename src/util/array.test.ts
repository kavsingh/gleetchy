import { mutWithout } from './array'

describe('Array util', () => {
  describe('mutWithout', () => {
    it('mutably removes items from passed in array', () => {
      const without1and3 = mutWithout([1, 3])
      const arr = [1, 2, 3, 4]

      without1and3(arr)

      expect(arr).toEqual([2, 4])

      without1and3(arr)

      expect(arr).toEqual([2, 4])
    })
  })
})
