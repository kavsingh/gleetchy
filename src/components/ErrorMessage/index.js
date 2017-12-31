import React from 'react'

import PropTypes from '~/PropTypes'
import { COLOR_ERROR, COLOR_EMPHASIS } from '~/constants/style'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('errorMessage', {
  root: {
    width: '100%',
    padding: '2em',
    fontSize: '0.9em',
    backgroundColor: COLOR_ERROR,
    color: COLOR_EMPHASIS,
  },
})

const ErrorMessage = ({ children }) => (
  <div className={classes.root}>{children}</div>
)

ErrorMessage.propTypes = {
  children: PropTypes.node,
}

ErrorMessage.defaultProps = {
  children: '',
}

export default ErrorMessage
