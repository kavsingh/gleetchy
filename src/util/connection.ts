type AudioNodeReturn = () => AudioNode

interface AudioNodeConnectableProxy {
  getInNode: AudioNodeReturn
  getOutNode: AudioNodeReturn
}

export const createConnect = (getOutNode: AudioNodeReturn) =>
  function connect(node: AudioNode | AudioNodeConnectableProxy) {
    const outNode = getOutNode()

    if (node instanceof AudioNode) {
      outNode.connect(node)
    } else if (typeof node.getInNode === 'function') {
      outNode.connect(node.getInNode())
    } else {
      throw new Error('Unable to connect to node')
    }
  }

export const createDisconnect = (getOutNode: AudioNodeReturn) =>
  function disconnect(node: AudioNode | AudioNodeConnectableProxy) {
    const outNode = getOutNode()

    if (!node) {
      outNode.disconnect()
    } else if (node instanceof AudioNode) {
      outNode.disconnect(node)
    } else if (typeof node.getInNode === 'function') {
      outNode.disconnect(node.getInNode())
    } else {
      throw new Error('Unable to disconnect node')
    }
  }

export const connectable = ({
  getInNode,
  getOutNode,
}: AudioNodeConnectableProxy) => (api: object) =>
  Object.assign(api, {
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
    getInNode,
    getOutNode,
  })
