const { jsContent, toConstantName } = require('../util')

module.exports = (type, name) =>
  jsContent(`
    export default '${toConstantName(type)}_${toConstantName(name)}'
  `)
