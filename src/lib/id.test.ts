import { prefixedId } from './id'

jest.mock('cuid', () => ({ slug: () => 'SLUG' }))

describe('lib/id', () => {
  describe('prefixedId', () => {
    it('generates a uuid with given prefix', () => {
      expect(prefixedId('')).toBe('-SLUG')
      expect(prefixedId('prefix')).toBe('prefix-SLUG')
    })
  })
})
