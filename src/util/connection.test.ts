import { always } from 'ramda'

import { connectable } from './connection'

const stubAudioNode = always(new AudioContext().createGain())

describe('util/connection', () => {
  describe('connectable', () => {
    it('creates a connectable node', () => {
      const node = connectable({
        getInNode: stubAudioNode,
        getOutNode: stubAudioNode,
      })({ type: 'node' })

      expect(node.connect).toEqual(expect.any(Function))
      expect(node.disconnect).toEqual(expect.any(Function))
      expect(node.getInNode).toEqual(expect.any(Function))
      expect(node.getOutNode).toEqual(expect.any(Function))
    })
  })
})
