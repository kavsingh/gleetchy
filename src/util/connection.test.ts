import { always } from 'ramda'

import { connectable } from './connection'

const stubAudioNode = always(new AudioNode())

describe('util/connection', () => {
  describe('connectable', () => {
    it('creates a connectable node', () => {
      const node = connectable({
        getInNode: stubAudioNode,
        getOutNode: stubAudioNode,
      })({ type: 'node' })

      expect(node.connect).toBe(expect.any(Function))
      expect(node.disconnect).toBe(expect.any(Function))
      expect(node.getInNode).toBe(expect.any(Function))
      expect(node.getOutNode).toBe(expect.any(Function))
    })
  })
})
