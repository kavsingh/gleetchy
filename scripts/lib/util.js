const { last, pipe, map, join, toUpper } = require('ramda')
const { stripIndent } = require('common-tags/lib')

const isUpper = c => c === c.toUpperCase()

const splitCamel = str =>
  str
    .split('')
    .reduce((acc, c) => {
      if (isUpper(c) || !last(acc)) acc.push([c])
      else last(acc).push(c)

      return acc
    }, [])
    .map(a => a.join(''))

const toConstantName = pipe(splitCamel, map(toUpper), join('_'))

const upperFirst = s => `${s[0].toUpperCase()}${s.slice(1)}`

const lowerFirst = s => `${s[0].toLowerCase()}${s.slice(1)}`

const jsContent = str => [stripIndent`${str}`, '\n'].join('')

module.exports = {
  upperFirst,
  lowerFirst,
  splitCamel,
  toConstantName,
  jsContent,
}
