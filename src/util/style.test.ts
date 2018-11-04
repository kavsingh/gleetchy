import { cssLabeled } from './style'

jest.mock('emotion', () => ({
  css: jest.fn(({ label }) => `css-hash-${label}`),
}))

describe('Style util', () => {
  describe('cssLabeled', () => {
    it('Applies css transform with labels', () => {
      const styles = { root: { dec: 'foo' }, inner: { dec: 'foo' } }

      expect(cssLabeled('', styles)).toEqual({
        inner: 'css-hash-inner',
        root: 'css-hash-root',
      })

      expect(cssLabeled('readableName', styles)).toEqual({
        inner: 'css-hash-readableName__inner',
        root: 'css-hash-readableName',
      })

      expect(() => (cssLabeled as any)(styles)).toThrow()
      expect(() => (cssLabeled as any)('')).toThrow()
    })
  })
})
