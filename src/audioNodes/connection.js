export const createConnect = getOutNode => node => {
  const outNode = getOutNode()

  if (node instanceof AudioNode) {
    outNode.connect(node)
  } else if (typeof node.getInNode === 'function') {
    outNode.connect(node.getInNode())
  } else {
    throw new Error('Unable to connect to node')
  }
}

export const createDisconnect = getOutNode => node => {
  const outNode = getOutNode()

  if (node instanceof AudioNode) {
    outNode.disconnect(node)
  } else if (typeof node.getInNode === 'function') {
    outNode.disconnect(node.getInNode())
  } else {
    throw new Error('Unable to disconnect to node')
  }
}
