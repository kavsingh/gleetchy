import { makeConnectable } from './connection'
import { noop } from './util'

const context = new AudioContext()

const createConnectableFromGainNodes = () => {
  const inNode = context.createGain()
  const outNode = context.createGain()

  jest.spyOn(inNode, 'connect')
  jest.spyOn(outNode, 'connect')

  return {
    inNode,
    outNode,
    node: makeConnectable({
      getInNode: jest.fn(() => inNode),
      getOutNode: jest.fn(() => outNode),
    })({ type: 'node', set: noop }),
  }
}

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
