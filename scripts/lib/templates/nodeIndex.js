const { jsContent } = require('../util')

module.exports = () =>
  jsContent(`
    import UI from './UI'
    import nodeType from './nodeType'
    import nodeProps from './nodeProps'
    import createAudioNode from './createAudioNode'

    export { UI, nodeType, nodeProps, createAudioNode }
  `)
