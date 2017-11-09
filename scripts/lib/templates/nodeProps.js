const { jsContent } = require('../util')

module.exports = () =>
  jsContent(`
    export default Object.freeze({ prop: 'value' })
  `)
