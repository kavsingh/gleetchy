import { describe, it, expect, vi } from 'vitest'

import { prefixedId } from './id'

vi.mock('cuid', () => ({ slug: () => 'SLUG' }))

describe('lib/id', () => {
  describe('prefixedId', () => {
    it('generates a uuid with given prefix', () => {
      expect(prefixedId('')).toBe('-SLUG')
      expect(prefixedId('prefix')).toBe('prefix-SLUG')
    })
  })
})
