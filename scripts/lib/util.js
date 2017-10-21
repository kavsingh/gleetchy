const { stripIndent } = require('common-tags/lib')

const upperFirst = s => `${s[0].toUpperCase()}${s.slice(1)}`

const lowerFirst = s => `${s[0].toLowerCase()}${s.slice(1)}`

const jsContent = str => [stripIndent`${str}`, '\n'].join('')

module.exports = {
  upperFirst,
  lowerFirst,
  jsContent,
}
