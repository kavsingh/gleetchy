const { stripIndent } = require('common-tags')
const { lowerFirst } = require('./util')

module.exports = componentName =>
  `${stripIndent`
  import React from 'react'
  import PropTypes from 'prop-types'

  const ${componentName} = ({ style }) => (
    <div className="${lowerFirst(componentName)}" style={style}>
      ${componentName}
      <style jsx>{\`
        .${lowerFirst(componentName)} {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      \`}</style>
    </div>
  )

  ${componentName}.propTypes = {
    style: PropTypes.shape({}),
  }

  ${componentName}.defaultProps = {
    style: {},
  }

  export default ${componentName}
`}\n`
