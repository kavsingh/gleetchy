const { jsContent } = require('../util')

module.exports = () =>
  jsContent(`
    import { always, curry, pick } from 'ramda'
    import { connectable } from '~/util/connection'
    import nodeType from './nodeType'
    import nodeProps from './nodeProps'

    export const pickProps = pick(Object.keys(nodeProps))

    export default curry((audioContext, initProps) => {
      const props = { ...nodeProps, ...pickProps(initProps || {}) }
      const inNode = audioContext.createGain()
      const outNode = audioContext.createGain()

      const transferProps = () => {}

      inNode.connect(outNode)

      return connectable({
        getInNode: always(inNode),
        getOutNode: always(outNode),
      })({
        type: nodeType,

        set(newProps = {}) {
          Object.assign(props, pickProps(newProps))
          transferProps()
        },
      })
    })
  `)
