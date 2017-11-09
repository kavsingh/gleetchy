const { jsContent } = require('../util')

module.exports = () =>
  jsContent(`
    import { curry, pick } from 'ramda'
    import { createConnect, createDisconnect } from '~/util/connection'
    import nodeType from './nodeType'
    import nodeProps from './nodeProps'

    export const pickProps = pick(Object.keys(nodeProps))

    export default curry((audioContext, initProps) => {
      const props = { ...nodeProps, ...pickProps(initProps || {}) }
      const inNode = audioContext.createGain()
      const outNode = audioContext.createGain()

      const transferProps = () => {}

      inNode.connect(outNode)

      const getInNode = () => inNode
      const getOutNode = () => outNode

      return {
        type: nodeType,

        set(newProps = {}) {
          Object.assign(props, pickProps(newProps))
          transferProps()
        },

        getInNode,
        getOutNode,
        connect: createConnect(getOutNode),
        disconnect: createDisconnect(getOutNode),
      }
    })
  `)
