import React from 'react'
import PropTypes from '~/PropTypes'
import { COLOR_ERROR, COLOR_EMPHASIS } from '~/constants/style'

const ErrorMessage = ({ children }) => (
  <div className="errorMessage">
    {children}
    <style jsx>{`
      .errorMessage {
        width: 100%;
        padding: 2em;
        font-size: 0.9em;
        background-color: ${COLOR_ERROR};
        color: ${COLOR_EMPHASIS};
      }
    `}</style>
  </div>
)

ErrorMessage.propTypes = {
  children: PropTypes.node,
}

ErrorMessage.defaultProps = {
  children: '',
}

export default ErrorMessage
