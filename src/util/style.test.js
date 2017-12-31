import { cssLabeled } from './style'

jest.mock('emotion', () => ({
  css: jest.fn(({ label }) => `css-hash-${label}`),
}))

describe('Style util', () => {
  describe('cssLabeled', () => {
    it('Applies css transform with labels', () => {
      const styles = { root: { dec: 'foo' }, inner: { dec: 'foo' } }

      expect(cssLabeled('', styles)).toEqual({
        root: 'css-hash-root',
        inner: 'css-hash-inner',
      })

      expect(cssLabeled(null, styles)).toEqual({
        root: 'css-hash-root',
        inner: 'css-hash-inner',
      })

      expect(cssLabeled('readableName', styles)).toEqual({
        root: 'css-hash-readableName',
        inner: 'css-hash-readableName__inner',
      })

      expect(() => cssLabeled(styles)).toThrow()
      expect(() => cssLabeled('')).toThrow()
    })
  })
})
