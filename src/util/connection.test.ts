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

      expect(node).toEqual(
        expect.objectContaining({
          connect: expect.any(Function),
          disconnect: expect.any(Function),
          getInNode: expect.any(Function),
          getOutNode: expect.any(Function),
        }),
      )
    })
  })
})
