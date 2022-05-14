import { describe, it, expect, vi } from 'vitest'

import { makeConnectable } from './connection'
import { noop } from './util'

const context = new AudioContext()

describe('lib/connection', () => {
  describe('makeConnectable', () => {
    it('creates a connectable node', () => {
      const { node } = createConnectableFromGainNodes()

      expect(node).toEqual(
        expect.objectContaining({
          connect: expect.any(Function),
          disconnect: expect.any(Function),
          getInNode: expect.any(Function),
          getOutNode: expect.any(Function),
        }),
      )
    })

    it('connects', () => {
      const a = createConnectableFromGainNodes()
      const b = createConnectableFromGainNodes()

      a.node.connect(b.node)

      expect(a.node.getOutNode).toHaveBeenCalledWith()
      expect(b.node.getInNode).toHaveBeenCalledWith()
      expect(a.outNode.connect).toHaveBeenCalledWith(b.inNode)
    })
  })
})

const createConnectableFromGainNodes = () => {
  const inNode = context.createGain()
  const outNode = context.createGain()

  vi.spyOn(inNode, 'connect')
  vi.spyOn(outNode, 'connect')

  return {
    inNode,
    outNode,
    node: makeConnectable({
      getInNode: vi.fn(() => inNode),
      getOutNode: vi.fn(() => outNode),
    })({ type: 'node', set: noop }),
  }
}
