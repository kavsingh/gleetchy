import React, { PureComponent } from 'react'

import PropTypes from '~/PropTypes'
import ErrorMessage from '~/components/ErrorMessage'

class ErrorBoundary extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = { error: undefined }
  }

  componentDidCatch(error) {
    this.setState(() => ({ error }))
  }

  render() {
    const { error } = this.state
    const { silent, renderError, children } = this.props

    if (error && !silent) {
      return renderError(error)
    }

    return <div>{children}</div>
  }
}

ErrorBoundary.propTypes = {
  renderError: PropTypes.func,
  children: PropTypes.node,
  silent: PropTypes.bool,
}

ErrorBoundary.defaultProps = {
  renderError: error => <ErrorMessage>{error.toString()}</ErrorMessage>,
  children: [],
  silent: false,
}

export default ErrorBoundary
