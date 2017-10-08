const { stripIndent } = require('common-tags')
const { lowerFirst } = require('./util')

module.exports = componentName =>
  `${stripIndent`
  import React from 'react'
  import PropTypes from 'prop-types'

  const ${componentName} = ({ name }) => (
    <div className="${lowerFirst(componentName)}">
      {name}
      <style jsx>{\`
        .${lowerFirst(componentName)} {
          display: flex;
        }
      \`}</style>
    </div>
  )

  ${componentName}.propTypes = {
    name: PropTypes.string,
  }

  ${componentName}.defaultProps = {
    name: ${componentName},
  }

  export default ${componentName}
`}\n`
