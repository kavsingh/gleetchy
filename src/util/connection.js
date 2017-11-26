export const createConnect = getOutNode =>
  function connect(node) {
    const outNode = getOutNode()

    if (node instanceof AudioNode) {
      outNode.connect(node)
    } else if (typeof node.getInNode === 'function') {
      outNode.connect(node.getInNode())
    } else {
      throw new Error('Unable to connect to node')
    }
  }

export const createDisconnect = getOutNode =>
  function disconnect(node) {
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

export const connectable = ({ getInNode, getOutNode }) => api =>
  Object.assign(api, {
    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  })
