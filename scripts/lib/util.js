const prettier = require('prettier')
const { curry, last, pipe, map, join, toUpper, identity } = require('ramda')
const { stripIndent } = require('common-tags/lib')

const prettierConfig = require('../../.prettierrc.js')

const isUpper = c => c === c.toUpperCase()

const splitOnPredicate = curry((pred, str) =>
  (Array.isArray(str) ? str : str.split(''))
    .reduce((acc, c) => {
      if (pred(c) || !last(acc)) acc.push([c])
      else last(acc).push(c)

      return acc
    }, [])
    .map(Array.isArray(str) ? identity : join('')),
)

const toConstantName = pipe(
  splitOnPredicate(isUpper),
  map(toUpper),
  join('_'),
)

const upperFirst = s => `${s[0].toUpperCase()}${s.slice(1)}`

const lowerFirst = s => `${s[0].toLowerCase()}${s.slice(1)}`

const jsContent = str => prettier.format(stripIndent`${str}`, prettierConfig)

module.exports = {
  upperFirst,
  lowerFirst,
  isUpper,
  splitOnPredicate,
  toConstantName,
  jsContent,
}
